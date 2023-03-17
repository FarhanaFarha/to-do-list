import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';
import { constants } from 'src/app/shared/constants';
import Swal from 'sweetalert2';
import { AddTaskComponent } from './add-task/add-task.component';
import { Task } from './models/task';
import { TasksService } from './services/tasks.service';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {

    taskList: Task[] = [];
    taskListSubscription: Subscription;
    showSpinner: boolean = false;
    noTaskFound: boolean = false;

    userId: string = "";
    userSubscription: Subscription;

    constructor(
        private dialog: MatDialog,
        private taskService: TasksService,
        private cd: ChangeDetectorRef,
        private toastr: ToastrService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.getUserId();
    }

    private getUserId() {
       this.userSubscription = this.authService.getUser().subscribe( authState => {
           this.userId = authState.uid;
           this.getTasksList();
        });
    }

    private getTasksList() {
        this.taskListSubscription = this.taskService.getTasksListByUserId(this.userId).subscribe((taskList: any) => {
            this.taskList = [];
            this.taskList = taskList;
            this.noTaskFound = this.taskList.length == 0 ? true : false;
            this.cd.markForCheck();
        }, (error) => {

        });
    }

    onClickAddTask() {
        this.dialog.open(AddTaskComponent, {
            width: '55%',
            minWidth: '300px',
            data: {
                formMode: constants.FORM_MODE_CREATE,
                userId: this.userId
            }
        });
    }

    onClickEditTask(task: Task) {
        this.dialog.open(AddTaskComponent, {
            width: '55%',
            minWidth: '300px',
            data: {
                task: task,
                formMode: constants.FORM_MODE_UPDATE,
                userId: this.userId
            }
        });
    }

    onClickDeleteTask(taskId: string) {
        Swal.fire({
            title: "Confirm",
            text: "Are you sure, You want to delete this task?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel"
          }).then((result) => {
            if (result.isConfirmed) {
              this.deleteTask(taskId); 
            } else if (result.isDismissed) {
              
            }
          });
    }

    private deleteTask(taskId: string) {
        this.showSpinner = true;
        this.taskService.deleteTask(taskId, this.userId).then( (response: any) => {
            this.showSpinner = false;
            this.toastr.success("Successfully deleted task", "Success!");
        }, (error) => {
            this.showSpinner = false;
            if (error && error?.message) {
                this.toastr.error(error?.message, "Error!");
            } else {
                this.toastr.error("An unknown error occured", "Error!");
            }
        });
    }

    colorLuminance(hex: string) {
        if(hex) {
            let lum = 0.2;

            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            }
            lum = lum || 0;
        
            var rgb = "#", c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i*2,2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00"+c).substr(c.length);
            }
            return rgb;
        } else {
            return '#ffffff';
        }
    }

    ngOnDestroy(): void {
        if (this.taskListSubscription) {
            this.taskListSubscription.unsubscribe();
        }
        if(this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

}
