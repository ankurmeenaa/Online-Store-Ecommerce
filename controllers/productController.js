import productModel from "../models/productModel.js";
import fs from "fs"; //file system
import slugify from "slugify";
import CategoryModel from '../models/categoryModel.js'
import categoryModel from "../models/categoryModel.js";


export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields; //formidable package se using style me seekha
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000: //1mb size pic here written in KB
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;//img,png etc
    }
    await products.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")  //adding filters removing photo at initial stage taki request ka size na bde
      //photo ke liye alag api use karenge and dono ko merge karke use krenge taki application ki performance acchi ho
      .limit(12)  //sirf 12 products show ho
      .sort({ createdAt: -1 }); // createdat ki property se sort karenge
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType); //content type ko set kar rhe hai.
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  console.log("hello")
  try {
    const prod = await productModel.findById(req.params.pid).select("-photo");
    if(!prod){
      console.log("prod not found")
      res.status(404).send({message: "product not found"})
    }
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

//filters
export const productFiltersController = async (req,res) =>{
  try {
    //checkbox and radio button dono ke get karenge
    const {checked,radio} = req.body;
    let args = {}
    if(checked.length > 0) args.category = checked
    if(radio.length) args.price = {$gte: radio[0],$lte:radio[1]} 
    const products = await productModel.find(args);
    res.status(200).send({
      success:true,
      products
    });

  } catch (error) {
    console.log(error);
    res.status(400).send({
     success:false,
     message:"Error while filtering products",
     error
     })
  }
}

//product count
export const productCountController = async (req,res) =>{
  try {
     const total = await productModel.find({}).estimatedDocumentCount()
     res.status(200).send({
      success:true,
      total
     })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message:"Error in product count.",
      error,
      success:false
    })
    
  }
}

//product list based on page
export const productListController = async(req,res) =>{
  try {
     const perPage = 6;
     const page = req.params.page? req.params.page : 1
     const products = await productModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})
     res.status(200).send({
      success:true,
      products
     })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:"Error in per page",
      error
    })
  }
}

//search product
export const searchProductController = async (req,res) =>{
  try {
      const {keyword} = req.params
      const results = await productModel.find({
        $or:[
        // We're searching for the keyword in both the 'name' and 'description' fields.
        // If the keyword is found in either of them, the document will be included in the results.
          {name:{$regex :keyword,$options:"i"}},   // Case-insensitive search for 'name' field.
          {description:{$regex :keyword,$options:"i"}}

         // In MongoDB, the $or operator is a logical operator used to perform a logical OR operation between multiple conditions. It's commonly used when you want to retrieve documents that satisfy at least one of several conditions. In the context of your code, the $or operator is being used to search for documents in the productModel collection that match either of the two conditions specified.
         // The $regex operator is used for pattern matching in MongoDB queries. It allows you to search for documents where a specific field matches a specified regular expression pattern. A regular expression (regex) is a sequence of characters that defines a search pattern. The $regex operator is often used for more flexible and complex searching within string fields.
         //The $options parameter in the $regex operator is used to specify options for the regular expression pattern. In your code, the i option is used, which stands for "case-insensitive". 
        ]
      }).select("-photo")
      res.json(results)    // Sending the search results as a JSON response.
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:"Error in Search Product API",
      error
    })
  }
}

// Similar Products
export const relatedProductController = async(req,res) => {
  try {
     const {pid,cid} = req.params //get productid and categoryid from params
     const products = await productModel.find({
      category:cid,
      _id:{$ne:pid}
     }).select("-photo").limit(3).populate("category")
     res.status(200).send({
      success:true,
      products
     })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false, 
      message:"Error while getting related products.",
      error
    })
  }
}

// get products category wise
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};