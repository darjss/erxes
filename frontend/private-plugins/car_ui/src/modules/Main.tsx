import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';

import { Spinner } from 'erxes-ui';

const CarsIndexPage = lazy(() =>
  import('~/pages/cars/CarsIndexPage').then((module) => ({
    default: module.CarsIndexPage,
  })),
);

const CarDetailPage = lazy(() =>
  import('~/pages/cars/CarDetailPage').then((module) => ({
    default: module.CarDetailPage,
  })),
);

const Main = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/car" element={<CarsIndexPage />} />
        <Route path="/car/:carId" element={<CarDetailPage />} />
      </Routes>
    </Suspense>
  );
};

export default Main;
