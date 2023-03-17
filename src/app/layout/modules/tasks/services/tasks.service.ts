import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { constants } from 'src/app/shared/constants';
import { Task } from '../models/task';

@Injectable({
    providedIn: 'root'
})
export class TasksService {

    authState: any = null;

    constructor(
        private angularFirestore: AngularFirestore
    ) {

    }

    getTasksListByUserId(userId: string) {
        return this.angularFirestore
            .collection(constants.FIRESTORE_TO_DO_LIST_COLLECTION)
            .doc(userId)
            .collection(constants.FIRESTORE_TASKS_COLLECTION, (ref) =>
                ref.orderBy('createdTimestamp', "desc")
            )
            .valueChanges();
    }

    addTask(task: Task, userId: string) {
        let doc = this.angularFirestore.collection(constants.FIRESTORE_TO_DO_LIST_COLLECTION)
            .doc(userId)
            .collection(constants.FIRESTORE_TASKS_COLLECTION)
            .doc();
        let id = doc.ref.id;
        task.id = id;

        return this.angularFirestore.collection(constants.FIRESTORE_TO_DO_LIST_COLLECTION)
            .doc(userId)
            .collection(constants.FIRESTORE_TASKS_COLLECTION)
            .doc(id)
            .set(task);
    }

    updateTask(task: Task, userId: string) {
        return this.angularFirestore.collection(constants.FIRESTORE_TO_DO_LIST_COLLECTION)
            .doc(userId)
            .collection(constants.FIRESTORE_TASKS_COLLECTION)
            .doc(task?.id)
            .update(task);
    }

    deleteTask(taskId: string, userId: string) {
        return this.angularFirestore.collection(constants.FIRESTORE_TO_DO_LIST_COLLECTION)
            .doc(userId)
            .collection(constants.FIRESTORE_TASKS_COLLECTION)
            .doc(taskId)
            .delete();
    }

}
