Product Requirements Document (PRD)
Gap Schedule Booking Platform

1. Executive Summary
   1.1 Product Overview
   A web-based marketplace platform connecting activity providers (fitness centers, swimming pools, etc.) with customers by selling unused time slots at discounted rates using a credit-based system.
   1.2 Business Model

Sell membership plans with credit points to individual customers
Sell batch credit packages to corporate clients
Compensate activity providers per booking
Monetize otherwise empty time slots in provider schedules

1.3 Target Users

Individual Customers: Looking for affordable access to fitness and recreational activities
Corporate Clients: Companies providing wellness benefits to employees
Activity Providers: Fitness centers, pools, and activity venues with schedule gaps
Platform Administrators: Internal team managing the marketplace

2. User Personas
   2.1 Individual Customer (Sarah)

Age: 28-45
Wants flexible, affordable fitness options
Prefers pay-as-you-go over fixed memberships
Books activities 1-7 days in advance

2.2 Corporate HR Manager (James)

Manages employee wellness programs
Needs bulk credit distribution and usage monitoring
Requires reporting on employee engagement

2.3 Corporate Employee (Maria)

Receives wellness credits from employer
Uses platform occasionally for fitness activities
Wants simple booking process

2.4 Activity Provider (David)

Owns/manages fitness center or pool
Has predictable schedule gaps
Wants to monetize unused capacity without complex admin
Needs 500+ providers to manage efficiently

2.5 Platform Administrator

Manages provider onboarding and approval
Sets credit point values
Monitors platform health and transactions
Handles customer support escalations

3. Core Features & Requirements
   3.1 Activity Categories & Classification
   Functional Requirements:

FR-CAT-001: System shall support two main activity categories: Kids and Adults
FR-CAT-002: Each activity provider shall be assigned to one or both categories
FR-CAT-003: Activities shall be filterable by category in user-facing interfaces
FR-CAT-004: Categories shall be managed only by platform administrators

User Stories:

As a customer, I want to filter activities by Kids or Adults so I can find relevant options quickly
As an admin, I want to categorize providers so customers can easily navigate offerings

3.2 Activity Provider Management
Functional Requirements:
Provider Registration & Approval:

FR-PROV-001: New activity providers shall submit registration applications
FR-PROV-002: Admin shall review and approve/reject provider applications
FR-PROV-003: Provider profile shall include: business name, description, location, contact info, facilities
FR-PROV-004: Providers shall offer multiple activity types (e.g., swimming, yoga, gym access)

Activity Type Configuration:

FR-PROV-005: Each activity type shall be assigned a credit point value by platform admin
FR-PROV-006: Activity types shall specify: name, credit cost, duration, gender restriction (Male/Female/Mixed)
FR-PROV-007: Providers shall be able to add/edit their offered activity types after approval

User Stories:

As an activity provider, I want to register on the platform so I can offer my unused time slots
As an admin, I want to review provider applications so I ensure quality standards
As a provider, I want to offer multiple activity types so I can fill different schedule gaps

3.3 Schedule Management System
Functional Requirements:
Weekly Schedule Template:

FR-SCHED-001: Providers shall configure a repeating weekly schedule template for 1 month periods
FR-SCHED-002: Each day's schedule shall define:

Activity type
Gender restriction (Male/Female/Mixed)
Time range (start time - end time)
Daily limit (maximum bookings per day)

FR-SCHED-003: Providers shall be able to set different configurations for each day of the week
FR-SCHED-004: Weekly pattern shall repeat automatically for the configured month

Schedule Exceptions & Blackout Dates:

FR-SCHED-005: Providers shall be able to block specific dates (holidays, maintenance)
FR-SCHED-006: Blocked dates shall prevent all bookings for that day
FR-SCHED-007: Providers shall be able to modify schedules with minimum 24-hour advance notice

Bulk Schedule Management:

FR-SCHED-008: System shall provide bulk import functionality (CSV/Excel template) for initial schedule setup
FR-SCHED-009: System shall provide a visual calendar interface for quick schedule editing
FR-SCHED-010: Providers shall be able to copy previous month's schedule to new month
FR-SCHED-011: System shall support quick-fill options (apply same settings to multiple days)

User Stories:

As an activity provider, I want to set up my monthly schedule quickly so I don't spend hours on data entry (given 500+ providers need this)
As a provider, I want to block out holidays so customers can't book when I'm closed
As a provider, I want to copy last month's schedule so I can make minor adjustments quickly
As an admin, I want providers to configure schedules efficiently so onboarding scales

3.4 Membership Plans (Individual Customers)
Functional Requirements:
Plan Structure:

FR-PLAN-001: Each membership plan shall include:

Credit points amount
Duration (typically 30 days)
Price
Plan name/description

FR-PLAN-002: Platform admin shall create and manage membership plans
FR-PLAN-003: Users shall be able to purchase multiple plans (credits accumulate)

Credit Expiration & Grace Period:

FR-PLAN-004: Credits shall expire at the end of plan duration
FR-PLAN-005: When credits expire with remaining balance, user shall receive 7-day grace period for recharge
FR-PLAN-006: Grace period duration shall be configurable by admin
FR-PLAN-007: If user recharges within grace period, unused credits shall roll over to new balance
FR-PLAN-008: If user does not recharge within grace period, remaining credits shall be forfeited
FR-PLAN-009: System shall send notifications at: plan expiration, grace period start, 2 days before grace period end

Credit Usage:

FR-PLAN-010: Credits shall be deducted when booking is confirmed
FR-PLAN-011: Users cannot book activities exceeding their available credit balance
FR-PLAN-012: Credits from oldest purchase shall be used first (FIFO)

User Stories:

As a customer, I want to buy a monthly plan with credits so I can access various activities
As a customer, I want my unused credits to roll over if I recharge in time so I don't lose value
As a customer, I want to see my credit balance and expiration date so I can plan my usage

3.5 Corporate Batch Credits
Functional Requirements:
Company Account Structure:

FR-CORP-001: Companies shall have separate master accounts from individual users
FR-CORP-002: Company admins shall have dedicated dashboard access
FR-CORP-003: Employee accounts shall be linked to company but remain separate entities

Credit Distribution:

FR-CORP-004: Companies shall purchase bulk credit packages
FR-CORP-005: System shall support automated employee provisioning via phone number list upload (CSV/Excel)
FR-CORP-006: Each employee shall be allocated specific credit amount for specific period
FR-CORP-007: Employee credits shall be separate from any personal membership credits
FR-CORP-008: Company credits shall follow same expiration rules as individual plans
FR-CORP-009: Company can set different credit amounts for different employees in same batch

Company Administration:

FR-CORP-010: Company admins shall view real-time usage dashboard showing:

Total credits purchased
Total credits distributed
Total credits used
Credits remaining (company pool)
Employee-level usage breakdown

FR-CORP-011: Company admins shall be able to:

Add new employees and allocate credits
View individual employee usage history
Export usage reports (CSV/PDF)
Top up specific employee credits

FR-CORP-012: Company admins shall receive alerts when company credit pool is low

Employee Experience:

FR-CORP-013: Employees shall register/login using company-provided phone number
FR-CORP-014: Employees shall see separate balances for company credits and personal credits (if any)
FR-CORP-015: Company credits shall be used before personal credits when booking
FR-CORP-016: Employees shall book activities using same credit requirements as individual users

User Stories:

As a company HR manager, I want to upload employee phone numbers and allocate credits automatically so I can provision 100+ employees efficiently
As a company admin, I want to monitor employee usage in real-time so I can measure wellness program ROI
As an employee, I want to use my company credits separately from personal credits so I can track benefits vs personal spending
As an employee, I want the same booking experience as regular users so I don't need separate training

3.6 Booking System
Functional Requirements:
Booking Process:

FR-BOOK-001: Users shall be able to browse available activities by:

Category (Kids/Adults)
Location
Activity type
Date
Gender restriction

FR-BOOK-002: Users shall be able to book activities any time in advance (no maximum limit)
FR-BOOK-003: Booking confirmation shall:

Deduct credits immediately
Generate booking ID
Show provider details and time
Send confirmation notification

FR-BOOK-004: Users cannot book if:

Insufficient credits
Daily limit reached for that day
Gender restriction doesn't match user profile
Date is blocked by provider

Booking Management:

FR-BOOK-005: Users shall be able to view their booking history
FR-BOOK-006: Users shall be able to cancel bookings with minimum 24-hour notice
FR-BOOK-007: Cancelled bookings shall refund credits to user account
FR-BOOK-008: No-shows (user doesn't attend) shall still deduct credits
FR-BOOK-009: For company employees: no-shows shall still count against company credits (company charged, provider not compensated)

Provider View:

FR-BOOK-010: Providers shall see list of confirmed bookings with:

Customer name
Phone number
Booking time
Activity type
Booking ID

FR-BOOK-011: Providers shall be able to mark attendance/no-show
FR-BOOK-012: Providers shall receive notifications for new bookings

Capacity Management:

FR-BOOK-013: System shall enforce daily limit per activity type
FR-BOOK-014: When daily limit is reached, time slot shall show as "Fully Booked"
FR-BOOK-015: No waiting list functionality (per requirement)

User Stories:

As a customer, I want to book activities in advance so I can secure my preferred time
As a customer, I want to cancel bookings with 24-hour notice so I can get my credits back
As a provider, I want to see who booked so I can prepare and verify attendance
As a provider, I want to mark no-shows so I'm not incorrectly compensated

3.7 Payment & Transaction System
Functional Requirements:
Payment Processing:

FR-PAY-001: System shall support payment gateway integration for membership purchases
FR-PAY-002: Users shall be able to purchase plans using: credit/debit cards, mobile wallets
FR-PAY-003: Companies shall be able to purchase bulk credits via invoice or corporate payment methods
FR-PAY-004: All transactions shall be recorded with: user ID, amount, credits purchased, timestamp

Provider Compensation:

FR-PAY-005: Providers shall be compensated per confirmed booking (attended only)
FR-PAY-006: No-shows shall NOT trigger provider compensation
FR-PAY-007: System shall calculate provider payouts based on:

Number of attended bookings
Agreed rate per booking type

FR-PAY-008: Provider payout reports shall be generated monthly
FR-PAY-009: Platform shall retain margin between credit value charged to users and provider compensation

Financial Tracking:

FR-PAY-010: System shall track:

Revenue from membership sales
Revenue from corporate sales
Provider payouts
Net revenue

FR-PAY-011: Admin shall have access to financial dashboard and reports

User Stories:

As a customer, I want to pay securely for membership plans so I can start using the platform
As a provider, I want to be paid for attended bookings so I'm fairly compensated
As an admin, I want to track financial metrics so I can monitor business health

3.8 User Authentication & Access Control
Functional Requirements:
Authentication:

FR-AUTH-001: Primary authentication shall be phone number with OTP (One-Time Password)
FR-AUTH-002: OTP shall be valid for 10 minutes
FR-AUTH-003: Users shall verify phone number during registration
FR-AUTH-004: System shall support "remember this device" for 30 days

User Roles & Permissions:

FR-AUTH-005: System shall support four user roles:

Customer: Book activities, manage profile, view history
Corporate Admin: Manage employees, view company dashboard, allocate credits
Activity Provider: Manage schedules, view bookings, update profile
Platform Admin: Full system access, manage all entities

Access Control:

FR-AUTH-006: Each role shall have specific permissions enforced at API level
FR-AUTH-007: Users shall only access data relevant to their role
FR-AUTH-008: Session timeout shall occur after 24 hours of inactivity

User Stories:

As a user, I want to login with my phone number so I can access my account securely
As an admin, I want role-based access control so different users have appropriate permissions

3.9 User Portals & Interfaces
Functional Requirements:
Customer Portal:

FR-UI-001: Customers shall access web portal with:

Activity browse/search
Booking management
Credit balance and history
Profile management
Transaction history

Corporate Admin Portal:

FR-UI-002: Company admins shall access web portal with:

Employee management
Credit distribution
Usage dashboard and analytics
Bulk upload interface
Report generation

Activity Provider Portal:

FR-UI-003: Providers shall access web portal with:

Schedule management (visual calendar + bulk tools)
Booking list and attendance tracking
Profile and activity type management
Revenue reports
Performance analytics

Platform Admin Portal:

FR-UI-004: Platform admins shall access web portal with:

Provider approval workflow
Membership plan management
Credit point value configuration
Financial dashboard
System settings (grace period duration, etc.)
User support tools

User Stories:

As each user type, I want a dedicated portal tailored to my needs so I can efficiently complete my tasks

3.10 Notifications System
Functional Requirements:
Notification Types:

FR-NOTIF-001: System shall support SMS and in-app notifications
FR-NOTIF-002: Users shall receive notifications for:

Booking confirmation
Booking reminder (24 hours before)
Booking cancellation
Credit expiration warning
Grace period start
Grace period ending soon (2 days before)
Plan expiration
Company credit allocation (for employees)

Provider Notifications:

FR-NOTIF-003: Providers shall receive notifications for:

New booking
Booking cancellation
Schedule conflict alerts

Admin Notifications:

FR-NOTIF-004: Admins shall receive notifications for:

New provider registration
Low company credit pool alerts
System errors or issues

User Stories:

As a customer, I want reminders before my bookings so I don't forget to attend
As a customer, I want alerts before credits expire so I can recharge in time
