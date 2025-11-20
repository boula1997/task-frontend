import type { Task } from "../../api/tasks";

// Add this interface for API response
export interface TasksResponse {
  data: Task[];
  current_page: number;
  last_page: number;
  total: number;
  // Add other pagination fields as needed
}


export interface TasksState {
  tasks: TasksResponse | null;  // Changed from Task[] to TasksResponse
  filteredTasks: Task[];        // Keep this for client-side if needed
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
  | { type: "FETCH_SUCCESS"; payload: TasksResponse }  // Changed to TasksResponse
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
      return { 
        ...state, 
        loading: false, 
        tasks: action.payload,
        filteredTasks: action.payload.data // Set filteredTasks to the data from API
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_TASK":
      // If you need to handle adding tasks, you'll need to update this logic
      return state;
    case "UPDATE_TASK":
      // If you need to handle updating tasks, you'll need to update this logic
      return state;
    case "DELETE_TASK":
      // If you need to handle deleting tasks, you'll need to update this logic
      return state;
    case "SET_FILTER":
      return {
        ...state,
        filters: { ...state.filters, [action.payload.field]: action.payload.value },
      };
    case "APPLY_FILTERS":
      // For server-side filtering, we don't need client-side filtering
      // Just trigger a new API call with filters
      return state;
    case "RESET_FILTERS":
      return {
        ...state,
        filters: { title: "", description: "", priority: "", status: "", dueFrom: "", dueTo: "" },
        // Don't reset filteredTasks here since we want to keep the server response
      };
    default:
      return state;
  }
};

