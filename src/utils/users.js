//a new file that has functions to keep track of the users
const users = []
//4 funcs in total
// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room})=>{
    //clean the data
    username = username.trim().toLowerCase() //so that Abcd and abcd wouldn't coexist 
    room = room.trim().toLowerCase()

    //validate data
    if(!username || !room){
        return{
            error: "username and room required!" 
        }
    }

    //check for existing user 
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username 
    })

    //validate username
    if(existingUser){
        return{
            error:"Username is in use!"
        }
    }

    //store username
    const user = {id, username, room}
    users.push(user)
    return{ user } 

}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id) //findIndex runs for every element in arr until the match is found
    if(index!==-1){
        return users.splice(index, 1)[0]
    }
}


const getUser = (id)=>{
    return users.find((user)=> user.id === id)
}
const getUsersInRoom = (room)=>{
    return users.filter((user)=> user.room === room) 
}
module.exports = {
    addUser, 
    removeUser, 
    getUser, 
    getUsersInRoom
}
