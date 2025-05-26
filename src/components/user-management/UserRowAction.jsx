import { EditPencilIcon, TrashIcon } from "@/components/icons"
// import { EyeIcon } from "@/components/icons"
import { IconButton } from "@/components/ui/IconButton"
import { memo } from "react"
import { deleteUser } from "../../api/auth"
import Swal from "sweetalert2"

export const UserRowActions = memo(({user, setUsers}) => {
  const classes = `hover:bg-zinc-200 p-1`

  const handleDelete = async (id) => {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });
  
      if (confirm.isConfirmed) {
        try {
          await deleteUser(id);
  
          setUsers((prev) => prev.filter((mod) => mod.id !== id));
          Swal.fire("Deleted!", "Moderator has been removed.", "success");
        } catch (err) {
          console.error("Delete failed:", err.message);
          Swal.fire("Error", "Failed to delete moderator.", "error");
        }
      }
    };

  return (
    <>
      {/* <IconButton icon={EyeIcon} size={15} className={classes} /> */}
      {/* <IconButton icon={EditPencilIcon} size={15} className={classes} /> */}
      <IconButton
        icon={TrashIcon}
        size={15}
        className={`${classes} text-red-500`}
        onClick={() => handleDelete(user.id)}
      />
    </>
  )
})

UserRowActions.displayName = "UserRowActions"
