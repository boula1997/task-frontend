import type { Task } from "../../api/tasks";

export interface TasksState {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  filters: {
    title: string;
    description: string;
    priority: string;
    status: string;
    dueFrom: string;
    dueTo: string;
  };
}

export type TasksAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Task[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: number }
  | { type: "SET_FILTER"; payload: { field: string; value: string } }
  | { type: "APPLY_FILTERS" }
  | { type: "RESET_FILTERS" };



export const initialState: TasksState = {
  tasks: [],
  filteredTasks: [],
  loading: false,
  error: null,
  filters: {
    title: "",
    description: "",
    priority: "",
    status: "",
    dueFrom: "",
    dueTo: "",
  },
};


export const tasksReducer = (state: TasksState, action: TasksAction): TasksState => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, tasks: action.payload, filteredTasks: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload], filteredTasks: [...state.filteredTasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => t.id === action.payload.id ? action.payload : t),
        filteredTasks: state.filteredTasks.map((t) => t.id === action.payload.id ? action.payload : t),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        filteredTasks: state.filteredTasks.filter((t) => t.id !== action.payload),
      };
    case "SET_FILTER":
      return {
        ...state,
        filters: { ...state.filters, [action.payload.field]: action.payload.value },
      };
    case "APPLY_FILTERS":
      const { title, description, priority, status, dueFrom, dueTo } = state.filters;
      return {
        ...state,
        filteredTasks: state.tasks.filter((task) => {
          const taskStatus = task.is_completed ? "completed" : "incomplete";
          const taskDue = new Date(task.due_date);
          const fromDate = dueFrom ? new Date(dueFrom) : null;
          const toDate = dueTo ? new Date(dueTo) : null;

          return (
            (!title || task.title.toLowerCase().includes(title.toLowerCase())) &&
            (!description || (task.description && task.description.toLowerCase().includes(description.toLowerCase()))) &&
            (!priority || task.priority === priority) &&
            (!status || taskStatus === status) &&
            (!fromDate || taskDue >= fromDate) &&
            (!toDate || taskDue <= toDate)
          );
        }),
      };
    case "RESET_FILTERS":
      return {
        ...state,
        filters: { title: "", description: "", priority: "", status: "", dueFrom: "", dueTo: "" },
        filteredTasks: state.tasks,
      };
    default:
      return state;
  }
};

