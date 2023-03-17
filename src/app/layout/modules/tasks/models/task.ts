export interface Task {
    id?: string;
    title: string;
    description: string;
    category: number;
    createdTimestamp: number;
    isCompleted: boolean;
    categoryName?: string;
    categoryColor?: string;
}