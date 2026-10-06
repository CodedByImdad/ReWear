export const CATEGORIES = [
  'Shirts',
  'T-Shirts',
  'Pants',
  'Jeans',
  'Jackets',
  'Dresses',
  'Shoes',
  'Accessories',
  'Other',
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

export const CONDITIONS = ['New', 'Like New', 'Good', 'Used'];

export const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];

export const TYPES = ['Exchange', 'Donation'];

export const ITEM_STATUSES = ['Available', 'Requested', 'Exchanged', 'Donated', 'Removed'];

export const REQUEST_STATUSES = ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'];

export const emptyFilterState = {
  search: '',
  category: '',
  size: '',
  condition: '',
  type: '',
  location: '',
  status: '',
};
