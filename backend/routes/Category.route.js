import express from 'express';
import {
    AddCategory,
    DeleteCategory,
    EditCategory,
    GetACategory,
    GetAllCategory
} from '../controllers/Category.controller.js';
import { onlyadmin } from '../middleware/onlyAdmin.js';

const CategoryRoute = express.Router();

CategoryRoute.post('/add',onlyadmin, AddCategory);
CategoryRoute.put('/edit/:categoryId',onlyadmin, EditCategory);
CategoryRoute.delete('/delete/:categoryId',onlyadmin, DeleteCategory);

CategoryRoute.get('/get-all-category', GetAllCategory);
CategoryRoute.get('/get-a-category/:categoryId',GetACategory);
export default CategoryRoute;