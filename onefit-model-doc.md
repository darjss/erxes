# OneFit Plugin — Model Documentation

All models are registered in `backend/plugins/onefit_api/src/connectionResolvers.ts`.  
IDs are typically string-based (`mongooseStringRandomId`); relations use string foreign keys, not MongoDB `ObjectId` refs.

## Collection index

| Mongoose key       | MongoDB collection              |
| ------------------ | ------------------------------- |
| ActivityCategory   | `onefit_activity_categories`    |
| ActivityType       | `onefit_activity_types`         |
| Provider           | `onefit_providers`              |
| ProviderReview     | `onefit_provider_reviews`       |
| City               | `onefit_cities`                 |
| District           | `onefit_districts`              |
| ScheduleTemplate   | `onefit_schedule_templates`     |
| ScheduleException  | `onefit_schedule_exceptions`    |
| MembershipPlan     | `onefit_membership_plans`       |
| CreditTransaction  | `onefit_credit_transactions`    |
| MembershipPurchase | `onefit_membership_purchases`   |
| Booking            | `onefit_bookings`               |
| SystemConfig       | `onefit_system_configs`         |
| OneFitCustomer     | `customers`                     |
| Banner             | `onefit_banners`                |
| PromoCode          | `onefit_promo_codes`            |

---

## 1. `onefit_activity_categories` (ActivityCategory)

**Purpose:** Hierarchical taxonomy for activity types and provider filtering.

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `name` (localized object, `en`/`mn`), `description` (localized), `parentId`, `isActive`, `image`, `icon`.

**Indexes:** `createdAt`; `{ name.en: 1, name.mn: 1 }`; `{ parentId: 1 }`.

**Relations:** `parentId` → same collection; referenced by `activityType.categoryIds[]`, `provider.categoryIds[]`.

---

## 2. `onefit_activity_types` (ActivityType)

**Purpose:** Bookable activity definition per provider (credits, duration, gender rules, categories).

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `providerId`, `name` / `description` (localized), `creditCost`, `price`, `duration`, `genderRestriction` (enum), `categoryIds[]`, `isActive`, `cancellationDeadline`, `singlePersonLimit`, `image`.

**Indexes:** `createdAt`, `providerId`; compound `{ categoryIds: 1 }`, `{ providerId: 1 }`.

**Relations:** `providerId` → `onefit_providers`; `categoryIds[]` → `onefit_activity_categories`.

---

## 3. `onefit_providers` (Provider)

**Purpose:** Gym/studio partner profile, location, approval workflow, geo search.

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `businessName` / `description` (localized), `location` (address/city/district localized, `coordinates`, `geoPoint` GeoJSON Point), `contactInfo` (phone, email, website), `facilities[]`, `categoryIds[]`, `singleProviderLimit`, `status` (enum), `rejectionReason`, `approvedAt` / `approvedBy`, `rejectedBy`, `isActive`, `icon`, `coverImages[]`, `instanceId` (multi-instance / SaaS).

**Indexes:** `createdAt`, `instanceId`; `{ status: 1 }`, `{ categoryIds: 1 }`, `{ status: 1, isActive: 1 }`, `{ instanceId: 1 }`, `location.geoPoint` **2dsphere**.

**Relations:** `categoryIds[]` → categories; parent of activity types, bookings, banners, reviews, schedules.

---

## 4. `onefit_provider_reviews` (ProviderReview)

**Purpose:** User ratings/comments for a provider; optionally tied to a booking.

**Core fields:** `_id`, `providerId`, `userId`, `bookingId` (optional), `activityTypeId`, `rating` (1–5), `comment`, timestamps.

**Indexes:** `providerId`, `userId`, `activityTypeId`; `{ providerId: 1, createdAt: -1 }`; unique partial on `bookingId` when `bookingId > ''`.

**Relations:** `providerId` → providers; `activityTypeId` → activity types; `bookingId` → `onefit_bookings.bookingId` (business id).

---

## 5. `onefit_cities` (City)

**Purpose:** Reference data for cities (localized name, code, active flag).

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `name` (localized), `code`, `isActive`.

**Indexes:** `createdAt`; `{ isActive: 1 }`; `{ code: 1 }`.

**Relations:** Referenced by `onefit_districts.cityId` (logical); provider `location` may embed city text separately.

---

## 6. `onefit_districts` (District)

**Purpose:** Districts belonging to a city.

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `cityId`, `name` (localized), `code`, `isActive`.

**Indexes:** `createdAt`, `cityId`; `{ cityId: 1, isActive: 1 }`; `{ isActive: 1 }`.

**Relations:** `cityId` → `onefit_cities._id`.

---

## 7. `onefit_schedule_templates` (ScheduleTemplate)

**Purpose:** Monthly recurring schedule template per provider (`dailySchedules` per weekday).

**Nested `dailySchedules[]`:** `dayOfWeek`, `activityTypeId`, `genderRestriction`, `startTime`, `endTime`, `dailyLimit`.

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `providerId`, `month` (1–12), `year`, `dailySchedules`.

**Indexes:** `createdAt`; **unique** `{ providerId: 1, year: 1, month: 1 }`.

**Relations:** `providerId` → providers; nested `activityTypeId` → activity types.

---

## 8. `onefit_schedule_exceptions` (ScheduleException)

**Purpose:** One-off blocked dates (optional per activity type).

**Core fields:** `_id`, `createdAt`, `providerId`, `date`, `reason`, `activityTypeId` (optional).

**Indexes:** `createdAt`.

**Relations:** `providerId` → providers; `activityTypeId` → activity types.

---

## 9. `onefit_membership_plans` (MembershipPlan)

**Purpose:** Sellable membership product (credits, duration, price, sales tiers).

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `name`, `description`, `creditAmount`, `planType` (`normal` | `credit`), `duration` (days), `price`, `saleOptions[]` (`quantity`, `discountPercent`, `finalPrice`), `isActive`, `gracePeriodDuration` (days).

**Indexes:** `createdAt`.

**Relations:** Target of `membership_purchases.planId`; referenced from `customers.membershipPlanId`.

---

## 10. `onefit_credit_transactions` (CreditTransaction)

**Purpose:** Append-only **ledger** of credit changes per user (audit-friendly).

**Core fields:** `_id`, `createdAt`, `userId`, `amount`, `transactionType` (enum), `source` (enum), `bookingId`, `corporateCreditId`, `companyId`, `description`, `balanceAfter` (balance **after** this line).

**Indexes:** `createdAt`, `userId`, `corporateCreditId`; `{ userId: 1, createdAt: -1 }`; `{ bookingId: 1 }`.

**Design note:** Rows should not be deleted; reversals are new rows. `balanceAfter` must stay consistent with the sequence of `amount` values or integrity checks fail.

---

## 11. `onefit_membership_purchases` (MembershipPurchase)

**Purpose:** Commercial lifecycle of a plan purchase (payment, activation, expiry).

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `externalHistoryId`, `userId`, `companyId`, `planId`, `status` (enum), `purchasedAt`, `paidAt`, `activatedAt`, `expiresAt`, `amount`, `invoiceId`, `promoCodeId`, `removePreviousCredits`.

**Indexes:** Many single-field indexes on lifecycle ids; `{ userId: 1, createdAt: -1 }`, `{ userId: 1, status: 1 }`, `{ planId: 1 }`.

**Relations:** `planId` → membership plans; `promoCodeId` → promo codes.

**Business intent (target behaviour):**

- **Paid ≠ active:** Until activation, credits should not hit the usable balance (activation gates credit grant).
- **Deferred activation:** Multi-month / annual buyers may activate later; `activatedAt` / `expiresAt` derive from activation time, not only purchase time.
- **Corporate bulk users:** Many users should not all start the same calendar day; self-service activation per user is preferred over auto-activate-everyone-on-pay.

---

## 12. `onefit_bookings` (Booking)

**Purpose:** User reservation for a slot; separate **booking lifecycle** (`status`) vs **attendance** (`attendanceStatus`).

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `userId`, `providerId`, `activityTypeId`, `bookingDate`, `startTime`, `endTime`, `creditCost`, `price`, `status` (enum), `attendanceStatus` (enum), `bookingId` (**unique** business id), cancellation and attendance audit fields.

**Indexes:** Indexed foreign keys; unique `bookingId`; compounds for user history and provider calendar.

**Relations:** `providerId`, `activityTypeId` → respective collections; `credit_transactions.bookingId` links to `bookingId` string.

---

## 13. `onefit_system_configs` (SystemConfig)

**Purpose:** Key–value plugin configuration (mixed `value` type).

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `key` (**unique**), `value`, `description`.

**Indexes:** `createdAt`; unique `key`.

---

## 14. `customers` (OneFitCustomer)

**Purpose:** OneFit-facing customer profile and membership/credit snapshot (often aligned with core contacts; stored in shared `customers` collection name).

**Core fields:** `_id`, profile (`state`, names, emails, phones, `avatar`, …), `crmId`, `onefit2UserId`, `membershipPlanId`, `membershipExpiresAt`, `membershipStatus`, credit counters (`currentCreditBalance`, `totalCreditsEarned`, `totalCreditsUsed`), booking prefs/history (`preferredActivityTypes`, `bookingPreferences`, `lastBookingDate`, `totalBookings`), grace/hold flags, `__t` discriminator key.

**Indexes:** `membershipPlanId`, `membershipStatus`, `currentCreditBalance`, `lastBookingDate` (desc); plus indexed identity fields in schema.

**Relations:** `membershipPlanId` → membership plans; logical link to bookings/credits by `userId` / customer id conventions.

---

## 15. `onefit_banners` (Banner)

**Purpose:** Marketing banners tied to a provider (and optional `instanceId`).

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `image`, `providerId`, `type` (enum), `status` (enum), `instanceId`.

**Indexes:** `createdAt`, `instanceId`; compounds on `providerId`, `status`, `type`, and pairs.

**Relations:** `providerId` → providers.

---

## 16. `onefit_promo_codes` (PromoCode)

**Purpose:** Discount codes for checkout (type, value, validity window, usage limits).

**Core fields:** `_id`, `createdAt`, `modifiedAt`, `code` (**unique**), `discountType` (enum), `value`, `isCompanyTag`, `validFrom`, `validTo`, `usageLimit`, `usedCount`, `isActive`.

**Indexes:** Unique `code`; `isActive`, `validFrom`, `validTo`.

**Relations:** Referenced by `membership_purchases.promoCodeId`; `usedCount` incremented on successful payment callback.

---

## Cross-model relationship summary

- `district.cityId` → `city._id`
- `activity_type.providerId` → `provider._id`; `categoryIds[]` → `category._id`
- `provider.categoryIds[]` → `category._id`
- `booking.providerId` → `provider._id`; `booking.activityTypeId` → `activity_type._id`
- `schedule_template.providerId` → `provider._id`; nested `activityTypeId` → `activity_type._id`
- `schedule_exception` same pattern
- `membership_purchase.planId` → `membership_plan._id`; `promoCodeId` → `promo_code._id`
- `credit_transaction.bookingId` → `booking.bookingId` (string), not necessarily `_id`
- `provider_review.providerId` → `provider._id`; optional `bookingId` / `activityTypeId`
- `banner.providerId` → `provider._id`
- `customer.membershipPlanId` → `membership_plan._id`

---

## Machine-readable schema

See `onefit-json-schema-export.json` in the repo root for a JSON bundle of fields and indexes derived from the same Mongoose definitions.

---

## Membership purchase & credit transaction (MN)

**Гишүүнчлэлийн худалдан авалт**

- Төлсөн ч **идэвхжээгүй** бол хэрэглэгчийн ашиглах боломжтой credit дансанд credit **орох ёсгүй**; идэвхжүүлэлт (`activatedAt` гэх мэт) нь credit олгох хаалт болно.
- Олон сар / жилийн багц авсан хэрэглэгч **өөрөө** тохирсон үедээ нэвтэрч идэвхжүүлнэ; хугацаа ихэвчлэн идэвхжүүлсэн цагаас эхэлнэ.
- Байгууллага олон хэрэглэгч үүсгэхэд бүгд нэг өдөр эхлэх боломжгүй тул **хэрэглэгч бүр өөрөө** идэвхжүүлэх нь зөв; “төлбөр төлөгдөхөд бүгдийг шууд идэвхжүүлэх” нь ийм кейст тохиромжгүй.

**Credit transaction**

- Гүйлгээ бүр цагийн дарааллаар (`createdAt`) хадгалагдана — аудит, тайлангийн суурийг бүрдүүлнэ.
- `balanceAfter` нь **тэр гүйлгээний дараа** хэрэглэгч хэдэн credit-тэй үлдсэнийг илэрхийлнэ.
- Мөр устгах нь дараагийн `balanceAfter`-той зөрчил үүсгэнэ; тиймээс устгах биш, **эсрэг гүйлгээ** (reversal) нэмэх загвар зөв.
