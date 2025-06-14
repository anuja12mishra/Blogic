import express from 'express';
import {
    AddCategory,
    DeleteCategory,
    EditCategory,
    GetACategory,
    GetAllCategory
} from '../controllers/Category.controller.js';

const CategoryRoute = express.Router();

CategoryRoute.post('/add', AddCategory);
CategoryRoute.put('/edit/:categoryId', EditCategory);
CategoryRoute.delete('/delete/:categoryId', DeleteCategory);
CategoryRoute.get('/get-all-category', GetAllCategory);
CategoryRoute.get('/get-a-category/:categoryId',GetACategory);
export default CategoryRoute;