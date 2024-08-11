import { createContext, useState } from "react";

export const TaskManagerContext = createContext(null);

function TaskManagerProvider({children}){
    const [user, setUser] = useState(null);
    
    return <TaskManagerContext.Provider>{children}</TaskManagerContext.Provider>
}

export default TaskManagerProvider;