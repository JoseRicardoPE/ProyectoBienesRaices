import Property from "./Property.js";
import Price from "./Price.js";
import Category from "./Category.js";
import User from "./User.js";

Property.belongsTo(Price)
Property.belongsTo(Category)
Property.belongsTo(User)


export {
    Property, Price, Category, User
}