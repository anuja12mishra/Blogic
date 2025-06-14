import {
    handleError
} from "../helpers/handleError.js";
import Category from "../models/category.model.js";

export const AddCategory = async (req, res, next) => {
    try {
        const {
            name,
            slug
        } = req.body;
        
        if (!name || !slug) {
            return next(handleError(400, "All fields are required"));
        }
        
        const isCategoryExit = await Category.findOne({
            name
        });
        
        if (isCategoryExit) {
            return next(handleError(409, 'Category already exists'));
        }
        
        let newCategory = new Category({
            name,
            slug
        });
        
        newCategory = await newCategory.save();
        
        res.status(201).json({
            success: true,
            message: "Category added successfully",
            category: newCategory
        });
    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const DeleteCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        const existingCategory = await Category.findById(categoryId);

        if (!existingCategory) {
            return next(handleError(404, 'Category not found'));
        }

        const name = existingCategory.name;
        await Category.findByIdAndDelete(categoryId);

        return res.status(200).json({
            success: true,
            message: `Category '${name}' deleted successfully.`
        });
    } catch (error) {
        console.error("Error in DeleteCategory:", error);
        return next(handleError(500, "Internal Server Error"));
    }
};


export const GetACategory = async (req, res, next) => {
    try {
        const {categoryId} = req.params;
        const category = await Category.findById({_id:categoryId});
        if(!category){
            return next(handleError(404, 'Category not found'));
        }
        res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            category: category
        });
    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};
export const GetAllCategory = async (req, res, next) => {
    try {
        const categories = await Category.find({}).sort({name:1}).lean().exec();
        res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            categories: categories
        });
    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};

export const EditCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const { name, slug } = req.body;
        
        if (!name || !slug) {
            return next(handleError(400, "All fields are required"));
        }
        
        const isCategoryExit = await Category.findById(categoryId);
        
        if (!isCategoryExit) {
            return next(handleError(404, 'Category not found'));
        }
        
        // Check if another category with the same name exists (excluding current category)
        const duplicateCategory = await Category.findOne({
            name,
            _id: { $ne: categoryId }
        });
        
        if (duplicateCategory) {
            return next(handleError(409, 'Category with this name already exists'));
        }
        
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name, slug }
        );
        
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory
        });
    } catch (error) {
        console.error(error.message);
        next(handleError(500, error.message));
    }
};