import CommonButton from "@/components/common-button";
import AddNewTask from "@/components/tasks/add-new-task";
import TaskItem from "@/components/tasks/task-item";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskManagerContext } from "@/context";
import { getAllTasksApi, addNewTaskApi, deleteTaskApi, updateTaskApi } from "@/services";
import { Fragment, useContext, useEffect, useState } from "react";

function TaskPage() {
    const [ showDialog, setShowDialog ] = useState(false);
    const { loading, setLoading, tasksList, setTasksList, user, taskFormData, currentEditedId, setCurrentEditedId } = useContext(TaskManagerContext);

    async function fetchListOfTasks(){
        setLoading(true);
        const response = await getAllTasksApi(user?._id);
        
        if(response?.success) {
            setTasksList(response?.tasksList)
            setLoading(false);
        }
    }

    
   async function handleSubmit(getData) {
    const response = currentEditedId !== null ?
    await updateTaskApi({
        ...getData,
        _id : currentEditedId,
        userId : user?._id,
    })  
    : await addNewTaskApi(
       {
        ...getData,
        userId : user?._id,   
       });

       if(response) {
            fetchListOfTasks();
           setShowDialog(false)
           taskFormData.reset();
           setCurrentEditedId(null);
       }   
   }

   async function handleDelete(getTaskId){
    const response = await deleteTaskApi(getTaskId);
    if(response?.success){
        fetchListOfTasks();
    }
   }


    useEffect(()=>{
     if(user !== null)   fetchListOfTasks();
    },[user]);

    //console.log(tasksList);

    if(loading) return <Skeleton className={'w-full h-[550px] rounded-[6px] bg-black opacity-50'}/>

    return (
        <Fragment>
            <div className="mb-5">
                <CommonButton 
                onClick={()=>setShowDialog(true)} 
                buttonText={'Add New Task'}
                />
            </div>
            <div className="mt-5 flex flex-col">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        tasksList?.length > 0 ?
                        tasksList.map(taskItem => <TaskItem 
                            key={taskItem?._id}
                            setShowDialog={setShowDialog}
                             handleDelete={handleDelete} 
                             item={taskItem}
                             setCurrentEditedId = {setCurrentEditedId}
                             taskFormData={taskFormData}
                             />) 
                        : <h1>No tasks added! Please add one</h1>
                    }
                </div>
            </div>
            <AddNewTask 
            showDialog={showDialog}
            setShowDialog={setShowDialog}
            handleSubmit = {handleSubmit}
            taskFormData = {taskFormData}
            currentEditedId = {currentEditedId}
            setCurrentEditedId = {setCurrentEditedId}
            />
        </Fragment>
    )
}
export default TaskPage;