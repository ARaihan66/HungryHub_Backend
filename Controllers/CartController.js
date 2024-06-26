const foodModel = require("../Models/FoodModel");
const userModel = require("../Models/UserModel");
const stripe = require("stripe")(
  "sk_test_51MCL2QLd3ml1apOvUCtMBCGHUdDi4CT3TaS9HKcEgIIy5dkwkU3g0St5gUheTFJwdH2WAr5KIYpFekaBIG4b8G6H00AnmTzu96"
);

// Add to cart
const AddToCart = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming userId is passed as a route parameter
    const { id, name, price, rating, image, quantity } = req.body;

    // Check if the food item already exists in the user's cart
    const existingItem = await foodModel.findOne({ id, userId });

    if (existingItem) {
      // If the item exists in the cart, update its quantity and total price
      const updatedItem = await foodModel.findOneAndUpdate(
        { id, userId },
        {
          $set: {
            quantity: existingItem.quantity + 1,
            totalPrice: (existingItem.quantity + 1) * price, // Update total price based on new quantity
          },
        },
        { new: true } // Return the updated document
      );

      res.status(200).json({
        success: true,
        message: "Item quantity updated in cart",
        data: updatedItem,
      });
    } else {
      // If the item is not in the cart, add it as a new item
      const newItem = await foodModel.create({
        id,
        userId,
        name,
        price,
        rating,
        image,
        quantity: 1, // Initial quantity when adding a new item
        totalPrice: price, // Initial total price for the item
      });

      const existedUser = await userModel.findOneAndUpdate(
        { _id: userid },
        {
          $push: {
            cartItems: newItem._id,
          },
        }
      );

      if (!existedUser) {
        return res.status(400).json({
          success: false,
          message: "Failed to add to cart",
        });
      }

      res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: newItem,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get cart item
const GetCartItem = async (req, res) => {
  try {
    const userId = req.params.id;

    const cartItems = await foodModel.find({ userId });

    if (!cartItems) {
      return res.status(400).json({
        success: false,
        message: "No items found",
      });
    }

    res.status(200).json({
      success: false,
      message: "Get cart item",
      data: cartItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove item from cart
const RemoveFromCart = async (req, res) => {
  try {
    const id = req.params.id;

    const foodItem = await foodModel.findOneAndDelete({ _id: id });

    if (!foodItem) {
      return res.status(400).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food removed from cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Increment quantity
const IncrementQuantity = async (req, res) => {
  try {
    const id = req.params.id;

    const foodItem = await foodModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          quantity: quantity + 1,
          totalPrice: (quantity + 1) * price,
        },
      },
      {
        new: true,
      }
    );

    if (!foodItem) {
      return res.status(400).json({
        success: false,
        message: "No food item found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food quantity incremented",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Decrement quantity
const DecrementQuantity = async (req, res) => {
  try {
    const id = req.params.id;

    const foodItem = await foodModel.findOneAndUpdate(
      { _id: id, quantity: { $gt: 0 } },
      {
        $set: {
          quantity: quantity - 1,
          totalPrice: totalPrice - price,
        },
      },
      {
        new: true,
      }
    );

    if (!foodItem) {
      return res.status(400).json({
        success: false,
        message: "Food item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food quantity decremented",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check out
const CheckOut = async (req, res) => {
  try {
    const userId = req.id;

    const cartItems = await foodModel.findOne({ _id: userId });

    const session = await Stripe.chechout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => {
        return {
          price_date: {
            currency: "inr",
            product_data: {
              name: item.name,
              image: [item.image],
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173",
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Clear cart
const ClearCart = async (req, res) => {
  try {
    const userId = req.id;

    const deletedItem = await foodModel.deleteMany({ userId });
    const deletedList = await userModel.findOneAndUpdate(
      { _id: userId },
      {
        cartItems: [],
      }
    );

    if (!deletedItem || !deletedList) {
      return res.status(400).json({
        success: false,
        message: "Failed to clear to cart",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  AddToCart,
  GetCartItem,
  RemoveFromCart,
  IncrementQuantity,
  DecrementQuantity,
  CheckOut,
  ClearCart,
};
