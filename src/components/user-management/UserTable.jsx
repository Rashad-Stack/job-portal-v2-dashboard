import { Table } from "@/components/ui/table";
import clsx from "clsx";
import { UserRowActions } from "./UserRowAction";
import { ErrorInfoIcon } from "../icons/error-info";
import { getUserStatusColor } from "./utils/utils";
// import { Navigate, useNavigate } from "react-router";
import { deleteUser } from "../../api/auth";
import { useNavigate } from 'react-router';


export const UserTable = ({ users, isLoading, error, setUsers }) => {
  const renderTable = () => {
    if (isLoading) return <UserTableSkeleton />;
    if (error) return <UserTableError message={error} />;
    if (users.length === 0) return <UserTableNoData />;
    return <UserTableBody users={users} setUsers={setUsers} />;
  };

  return (
    <div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell>SL</Table.Cell>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>Email</Table.Cell>
            <Table.Cell>Role</Table.Cell>
            <Table.Cell>Action</Table.Cell> {/* Added Action column */}
          </Table.Row>
        </Table.Header>
        {renderTable()}
      </Table>
    </div>
  );
};

UserTable.displayName = "UserTable";

const UserTableBody = ({ users, setUsers }) => {
  const navigate = useNavigate(); // Move useNavigate to the top level
  const capitalizeFirstLetter = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
      Swal.fire("Success", "User deleted successfully", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEdit = (userId) => {
    navigate(`/moderator/edit/${userId}`); // Use the navigate function here
  };

  return (
    <Table.Body>
      {users.map((user, index) => (
        <Table.Row key={user.id}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell className="font-medium">
            {capitalizeFirstLetter(user?.name)}
          </Table.Cell>
          <Table.Cell>{user.email}</Table.Cell>
          <Table.Cell>{user.role}</Table.Cell>
          <Table.Cell>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDelete(user.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(user.id)} // Call handleEdit here
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Edit
              </button>
            </div>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  );
};

UserTableBody.displayName = "UserTableBody";

const UserTableSkeleton = () => {
  return (
    <Table.Body>
      {Array.from({ length: 10 }).map((_, index) => (
        <Table.Row key={index}>
          <Table.Cell>
            <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
          </Table.Cell>
          <Table.Cell>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          </Table.Cell>
          <Table.Cell>
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          </Table.Cell>
          <Table.Cell>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          </Table.Cell>
          <Table.Cell>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />{" "}
            {/* Added for Action column */}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  );
};
const UserTableNoData = () => {
  return (
    <Table.Body>
      <Table.Row className="col-span-full">
        <Table.Cell colSpan={5}>
          <div className="p-4 text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-600">
              No users found
            </h3>
            <p className="text-gray-500">There are no users to display.</p>
          </div>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  );
};

UserTableNoData.displayName = "UserTableNoData";

const UserTableError = ({ message }) => {
  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell colSpan={5}>
          <div className="p-4 text-center">
            <div className="mb-4 flex justify-center">
              <ErrorInfoIcon className="text-red-600" size={48} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-red-600">
              Error Loading Users
            </h3>
            <p className="text-red-500">{message}</p>
          </div>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  );
};
