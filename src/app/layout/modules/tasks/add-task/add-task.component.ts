import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { constants } from 'src/app/shared/constants';
import { Task } from '../models/task';
import { TasksService } from '../services/tasks.service';

@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

    taskForm: FormGroup;
    showSpinner: boolean = false;

    formMode: string = constants.FORM_MODE_CREATE;
    taskCategoryList = constants.TASK_CATEGORY_LIST;
    constants = constants;

    task: Task = null;
    userId: string = "";

    constructor(
        private dialogRef: MatDialogRef<AddTaskComponent>,
        private taskService: TasksService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) private data: {
            task: Task,
            formMode: string,
            userId: string
        }
    ) {
        this.dialogRef.disableClose = true;

        this.formMode = this.data && this.data?.formMode ? this.data?.formMode : constants.FORM_MODE_CREATE;
        this.task = this.data && this.data?.task ? this.data?.task : null;
        this.userId = this.data && this.data?.userId ? this.data?.userId : "";
    }

    ngOnInit(): void {
        this.initTaskForm();
        if(this.formMode === constants.FORM_MODE_UPDATE) {
           this.setFormValues(); 
        }
    }

    private initTaskForm() {
        this.taskForm = new FormGroup({
            title: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            category: new FormControl('', Validators.required),
            createdTimestamp: new FormControl(new Date().getTime()),
            isCompleted: new FormControl(false),
            categoryName: new FormControl(''),
            categoryColor: new FormControl('')
        });
    }

    onSelectCategory(event: MatSelectChange) {
        this.taskForm.get("category").setValue(event.value);
        let category = this.taskCategoryList.find(category => category.value === event.value);
        if (category != undefined) {
            this.taskForm.get("categoryName").setValue(category.label);
            this.taskForm.get("categoryColor").setValue(category.color);
        }
    }

    private setFormValues() {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        category: this.task.category,
        createdTimestamp: this.task.createdTimestamp,
        isCompleted: this.task.isCompleted,
        categoryName: this.task?.categoryName ? this.task?.categoryName : '',
        categoryColor: this.task.categoryColor ? this.task.categoryColor : ''
      });
    }

    private addTask(task: Task) {
        this.showSpinner = true;
        this.taskService.addTask(task, this.userId).then((response: any) => {
            this.showSpinner = false;
            this.toastr.success("Task added successfully", "Success!");
            this.dialogRef.close();
        }, (error) => {
            this.showSpinner = false;
            if (error && error?.message) {
                this.toastr.error(error?.message, "Error!");
            } else {
                this.toastr.error("An unknown error occured", "Error!");
            }
        });
    }

    private updateTask(task: Task) {
        this.showSpinner = true;
        task.id = this.task?.id;
        this.taskService.updateTask(task, this.userId).then((response: any) => {
            this.showSpinner = false;
            this.toastr.success("Task updated successfully", "Success!");
            this.dialogRef.close();
        }, (error) => {
            this.showSpinner = false;
            if (error && error?.message) {
                this.toastr.error(error?.message, "Error!");
            } else {
                this.toastr.error("An unknown error occured", "Error!");
            }
        });
    }

    onSubmitTask() {
        if (this.taskForm.valid) {
            let task: Task = this.taskForm.value;
            if (this.formMode === constants.FORM_MODE_CREATE) {
                this.addTask(task);
            } else if(this.formMode === constants.FORM_MODE_UPDATE) {
                this.updateTask(task);
            }
        } else {
            this.taskForm.markAllAsTouched();
        }
    }

    onClickCloseDialog() {
        this.dialogRef.close();
    }

}
