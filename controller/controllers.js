const db = require('../model/connection');
const nodemailer = require('nodemailer');


// add product api
exports.add_product = async (req, res) => {
    try {
        const { product_name, product_type, discription } = req.body;  // type script format(dstructure format)
        // const product_name = req.body.product_name  // we could try like that
        if (product_name) {
            if (product_type) {
                if (discription) {
                    db.query(`SELECT * from product where product_name = '${product_name}'`, (error, result) => {
                        if (error) {
                            res.status(409).json({ status: true, message: "Duplicate Record Can't Accept" });
                        } else if (result.length > 0) {
                            res.status(422).json({ status: true, message: "Already Exist" });
                        } else {
                            db.query(`INSERT INTO product SET ?`, { product_name, product_type, discription }, (error, result) => {
                                console.log("work")
                                if (error) {
                                    res.status(404).json({ status: false, message: "Product is't Inserted!" })
                                } else {
                                    res.status(200).json({ status: true, res: result, message: "Item inserted successfully." })
                                }
                            })
                        }
                    });
                } else {
                    res.status(200).json({ status: false, message: "Product description required!" })
                }
            } else {
                res.status(200).json({ status: false, message: "Product type required!" })
            }
        } else {
            res.status(200).json({ status: false, message: "Product name required!" })
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Product is't register! 1" })
        console.log(error)
    }
}


// get product api
exports.get_product = async (req, res) => {
    try {
        db.query(`select * from product`, (error, result) => {
            if (error) {
                console.log(error);
                res.status(200).json({ status: false, message: "Products not found1" });
            } else {
                res.status(200).json({ status: false, resp: result });  //resp is a object key(user define)
            }
        });

    } catch (error) {
        console.log(error)
        res.status(200).json({ status: false, message: "Products not found" });
    }
}
// update product api
exports.update_produuct = async (req, res) => {
    try {
        const product_name = req.body.product_name;
        const product_type = req.body.product_type;
        const discription = req.body.discription;
        const id = req.body.id;
        console.log(product_type, "product_type");

        if (id) {
            if (product_name) {
                if (product_type) {
                    if (discription) {
                        db.query(`select product_name from product where id = '${id}' `, (error, result) => {
                            if (error) {
                                console.log(error);
                                res.status(200).json({ status: false, message: "Product not found" });
                            } else {
                                db.query(`update product set product_name=' ${product_name}', product_type= '${product_type}', discription= '${discription}' where id = '${id}'`, (error, result) => {
                                    if (error) {
                                        console.log(error);
                                        res.status(200).json({ status: false, message: "Product are not updated333" });
                                    } else {
                                        res.status(200).json({ status: true, message: "Updated Successfully", res: result });
                                    }
                                });
                            };
                        });

                    } else {
                        res.status(200).json({ status: false, message: "Product Discription Required" });
                    }
                } else {
                    res.status(200).json({ status: false, message: "Product Type Required" });
                }

            } else {
                res.status(200).json({ status: false, message: "Product Name Required" });
            }
        } else {
            res.status(200).json({ status: false, message: "Product id Required" });
        }


    } catch (error) {
        console.log(error);
        res.status(200).json({ status: false, message: "Product Not Updated" });

    }
}
// delete product api 
exports.delete_product = async (req, res) => {
    const id = req.body.id;
    try {
        if (id) {
            db.query(`select id from product where id = '${id}'`, (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(200).json({ status: false, message: "Can not delete this" });
                } else {
                    console.log(result, "resultresult    ")
                    if (result.length > 0) {
                        db.query(`delete from product where id  = '${id}'`, (error, result) => {
                            if (error) {
                                console.log(error);
                                res.status(200).json({ status: false, message: "Product can't delete" });
                            } else {
                                res.status(200).json({ status: true, message: "Deleted Successfullt" });
                            }
                        });
                    } else {
                        res.status(200).json({ status: false, message: "product not exist" });
                    }
                }
            });

        } else {
            res.status(200).json({ status: false, message: "Can not delete" });
        }

    } catch (error) {
        console.log(error);
        res.status(200).json({ status: false, message: "Can not Delete" });
    }
};

//login api
exports.register_user = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (username) {
            if (email) {
                if (password) {
                    db.query(`insert into login set ?`, { username, email, password }, (error, result) => {
                        if (error) {
                            res.status(200).json({ status: true, message: "incorrect" })
                        } else {
                            res.status(200).json({ status: true, res: result })
                        }
                    })
                } else {
                    res.status(200).json({ status: true, message: "Password Required" })
                }
            } else {
                res.status(200).json({ status: true, message: "Email Required" })
            }
        } else {
            res.status(200).json({ status: true, message: "Username Required" })
        }
    } catch (error) {
        res.status(200).json({ status: true, message: "Error" })
    }
};



// exports.addToCartProduct = async (req, res) => {
//     try {
//         const { item_name, item_type, item_price, item_description } = req.body; 
//         if (!item_name) return res.status(404).json({ status: false, message: `item name required.` });
//         if (!item_type) return res.status(404).json({ status: false, message: `item name required.` });
//         if (!item_price) return res.status(404).json({ status: false, message: `item name required.` });
//         if (!item_description) return res.status(404).json({ status: false, message: `item name required.` });

//         const allowedFields = ['item_name', 'item_type', 'item_price', 'item_description'];
//         const unknownFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
//         if (unknownFields.length > 0) {
//             return res.status(400).json({ status: false, message: `Unknown Fields ${unknownFields.join(', ')}` })
//         };

//         const cartData = { item_name, item_type, item_price, item_description };
//         db.query(`SELECT * from add_cart where item_name = '${item_name}'`, (error, result) => {
//             if (error) {
//                 res.status(500).json({ status: false, message: "Failed to fetch data, Please try agian" })
//             } else if (result.length > 0) {
//                 res.status(409).json({ status: false, message: "product alredy exist!" })
//             } else {
//                 db.query(`INSERT INTO add_cart SET ?`, cartData, (error, result) => {
//                     if (error) {
//                         res.status(500).json({ status: false, message: "Failed to insert data." })
//                     } else {
//                         res.status(200).json({ status: true, message: 'Inserted Successfully.', res: result })
//                     }
//                 });
//             }
//         });
//     } catch (error) {
//         res.status(200).json({ status: false, message: `Internal server Error. '${error}'` });
//     }
// };