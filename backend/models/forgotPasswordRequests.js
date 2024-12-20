import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
// import  {Users}  from "./User.js";


export const forgotPasswordRequests = sequelize.define('forgetpassword', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    // UserId:DataTypes.STRING,
    isActive:{
       type: DataTypes.BOOLEAN, 
    }
});