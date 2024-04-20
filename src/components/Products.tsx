/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Title from './Title';
import CategoriesButton from './CategoriesButton';
import FullFeaturedCrudGrid from './DataTableV2';

export default function Products() {
  const [category, setCategory] = React.useState<any | null>(undefined);
  return (
    <React.Fragment>
      <Title>Produits</Title>
      <CategoriesButton setCategory={setCategory} />
      {
        category && <FullFeaturedCrudGrid categoryId={category.id} />
      }
    </React.Fragment>
  );
}
