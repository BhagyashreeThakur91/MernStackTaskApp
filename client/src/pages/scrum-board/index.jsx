import CommonCard from "@/components/common-card";
import { scrumBoardOptions } from "@/config";
import { TaskManagerContext } from "@/context";
import { getAllTasksApi, updateTaskApi } from "@/services";
import { Fragment, useContext, useEffect } from "react";

function ScrumBoardPage(){
    const {tasksList, setTasksList, user} = useContext(TaskManagerContext);

    async function fetchListOfTasks(){
        const response = await getAllTasksApi(user?._id);
        if(response?.success) {
            setTasksList(response?.tasksList)
        }
    }

    function renderTaskByTaskStatus(){
        const taskStatuses =  {
            todo : [],
            inProgress : [],
            blocked : [],
            review : [],
            done : []
        }

        tasksList.forEach((taskItem) => {
            taskStatuses[taskItem.status].push(
                <div 
                className="mb-2"
                onDragStart={
                    taskItem.status !== 'done' ? (event)=> onDragStart(event, taskItem._id) : null
                }
                draggable={taskItem?.status !== 'done' ? true : false}
                >
                    <CommonCard
                    extraTextStyles={taskItem?.status === 'done' ? "line-through" : ""}
                    title={taskItem?.title}
                    description={scrumBoardOptions.find(boardOption => boardOption.id === taskItem?.status).label}
                    />
                </div>
            )
        });
        return taskStatuses;
    }

    async function updateTaskByStatus(getTask){
        await updateTaskApi(getTask)
        fetchListOfTasks()
    }

    function onDrop(event, getCurrentStatus){
        const getDraggedTaskId = event.dataTransfer.getData('id');

        let findCurrentTask = tasksList.find(item => item._id.toString() === getDraggedTaskId);
        findCurrentTask = {
            ...findCurrentTask,
            status : getCurrentStatus
        }
        updateTaskByStatus(findCurrentTask)
    }

    function onDragStart(event, getTaskId){
        event.dataTransfer.setData('id', getTaskId);
    }

    useEffect(()=>{
       if(user !== null ) fetchListOfTasks();
    },[user])
    
    return (
        <Fragment>
            <div className="grid md:grid-cols-5 gap-2 h-full sm:grid-cols-2">
                {
                    scrumBoardOptions.map(item => <div 
                    key={item.id}
                    className="border border-[#333333]  rounded overflow-auto"
                     onDrop={(event)=> onDrop(event, item.id)}
                     onDragOver={(event)=> event.preventDefault()}
                     >
                        <div className="px-1 py-3 text-center bg-black border-none mb-3">
                            <h3 className="text-2xl font-extrabold text-white">{item.label}</h3>
                        </div>
                        <div className="p-3">
                            {renderTaskByTaskStatus()[item.id]}
                        </div>
                    </div>
                    )
                }
            </div>
        </Fragment>
    )
}

export default ScrumBoardPage;