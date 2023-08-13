import React, {useEffect, useState} from "react";
import UsersList from '../components/UsersList';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users');

        setLoadedUsers(responseData.users);
      } catch (err) {
      }
    };
    fetchUsers();
  }, [sendRequest]);


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;

//with fetch() request default request type is a GET request!
// I use the send request function in there and the send request function is coming from outside the effect. That's why it is important to have send request be wrapped and use callback here in the custom hook because if this would not be wrapped in use callback, it would be recreated whenever the hook reruns
// and the hook reruns, whenever the component that uses to hook reruns because there we call use HTTP client and it is just a regular JavaScript function after all.
// So of course it executes again.
// And if this reruns and gives us a new send request object, even with the same logic in the function,it's technically a new object.
// Use effect would fire again, send the new request and we would have an infinite loop. So use callback around send request in. */}
