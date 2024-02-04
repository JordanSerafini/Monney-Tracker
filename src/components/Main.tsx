import  { useState, useEffect } from 'react';
import Data from '../Data/database.json';

interface User {
  id: string;
  name: string;
  email: string;
}

function Main() {
  // Utilisez le type User[] pour initialiser l'état
  const [users, setUsers] = useState<User[]>([]);


  //console.log(users);

  useEffect(() => {
    // Map les données 
    const usersArray: User[] = Object.entries(Data.users).map(([id, userInfo]) => ({
      id: id,
      name: userInfo.name,
      email: userInfo.email
    }));
    
    // MAJ tableau d'utilisateurs
    console.log(usersArray);
    setUsers(usersArray);
  }, []); // exec 1 fois au montage

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          ID: {user.id}, Name: {user.name}, Email: {user.email}
        </div>
      ))}
    </div>
  );
}

export default Main;
