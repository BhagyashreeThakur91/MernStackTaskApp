import CommonDialog from "@/components/common-dialog";
import { addNewTaskFormControls } from "@/config";

function AddNewTask({ showDialog, currentEditedId, setCurrentEditedId, setShowDialog, handleSubmit, taskFormData }) {
    return (
        <CommonDialog
            formControls={addNewTaskFormControls}
            showDialog={showDialog}
            onOpenChange = {()=> {
                setShowDialog(false)
                currentEditedId ? taskFormData.reset() : null
                setCurrentEditedId(null)
            }}
            setShowDialog={setShowDialog}
            title={currentEditedId ? 'Edit Task' : 'Post New Task'}
            btnText={'Add'}
            handleSubmit={handleSubmit}
            formData={taskFormData}
        />
    );
}
export default AddNewTask;