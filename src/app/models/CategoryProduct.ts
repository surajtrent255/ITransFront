export class CategoryProduct {
  id !: number;
  name !: string;
  description !: string;
  parentId !: number;
  userId !: number;
  companyId !: number;
  createdDate !: Date;
  editedDate !: Date;
  childCategories !: CategoryProduct[];
}
