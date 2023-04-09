import { Request, Response } from 'express';
import { getIDfromToken } from '../../helpers/getIDfromToken';
import { transStrings } from '../../init/locales';
import { User } from '../models';
const bcrypt = require('bcryptjs');
const saltRounds = 10;



const updateProfileChanges = async (req: Request | any, res: Response) => {
  try {
    const { userId , image , name , mobile , email } = req.body;

        User.findOne({ _id: userId }).then(( result ) => {
         User.updateOne(
          { _id: result.id }, 
          { profileImage : image , name : name , email : email , mobile : mobile}).then(() => {
         User.findOne({ _id: userId }).then(( response ) => { 
          res.status(200).send( response );
        }); 
       })
     }) 
    
   } catch (err) {
        return console.log(res, err);
   }
  }



const AddFriend = async (req: Request | any, res: Response) => {
try {
  const { myId , friendName } = req.body;
      User.findOne({ _id: myId }).then(( result ) => {
       User.updateOne(
        { _id: result.id }, 
        { $push: { friends : { name : friendName }} }).then(() => {
       User.findOne({ _id: myId }).then(( response ) => { 
        res.status(200).send( response );
      }); 
     })
   }) 
  
 } catch (err) {
      return console.log(res, err);
 }
}

const removeFriend = async (req: Request | any, res: Response) => {
  try {
    const { myId , friendName } = req.body;
    console.log({ myId , friendName })
        User.findOne({ _id: myId }).then(( result ) => {
         User.updateOne(
          { _id: result.id }, 
          { $pull: { friends : { name : friendName }} }).then(() => {
         User.findOne({ _id: myId }).then(( response ) => { 
          res.status(200).send( response );
        }); 
       })
     }) 
    
   } catch (err) {
        return console.log(res, err);
   }
  }


const currentUserInfo = async (req: Request | any, res: Response) => {
 const { id } = req.body
  try{
  User.findOne({ _id : id }).then((user) => {
    console.log(user)
    res.status(200).send( user );
  })
 }
 catch(err){
  return console.log(res, err);
 }
}


const UserUpdate = async (req: Request | any, res: Response) => {
  const user_id = getIDfromToken(req);
  console.log('user_id', user_id);
  const { email, password, name } = req.body;
  if (email) delete req.body.email;
  if (name) req.body.name = name;
  if (password) {
    const newPassword = bcrypt.hashSync(password, saltRounds);
    req.body.password = newPassword;
  }
  const user = await User.findOneAndUpdate({ _id: user_id }, { $set: req.body }, { new: true });

  return res.status(200).send({
    success: true,
    message: req.t(transStrings.profileupdatedsuccessfuly),
    user: user,
  });
};

const UsersList = async (req: Request | any, res: Response) => {

 res.setHeader('Content-Type', 'application/json')
 try {
     /* #swagger.responses[200] = {
       description: "Users fetched successfully",
       schema: { $ref: "#/definitions/users"
     } */
     User.find({}).then((users: any) => {
      const userNames = users.map(( item : any) => ( item.name ))
      res.status(200).send(userNames);
    });
   } catch (err) {
     /* #swagger.responses[500] = {
       description: "Unknown server side error",
       schema:  { $ref: "#/definitions/server side error" }
     } */
     return console.log(res, err)
   }
};


export { UserUpdate, UsersList , AddFriend , currentUserInfo , removeFriend , updateProfileChanges };
