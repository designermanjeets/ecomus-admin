import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, 
         FormGroup, Validators } from '@angular/forms';
import { Subject, mergeMap, of, switchMap, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { Editor } from 'ngx-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateNotice, EditNotice, UpdateNotice } from '../../../shared/action/notice.action';
import { NoticeState } from '../../../shared/state/notice.state';
import { Notice } from '../../../shared/interface/notice.interface';

@Component({
  selector: 'app-form-notice',
  templateUrl: './form-notice.component.html',
  styleUrl: './form-notice.component.scss'
})
export class FormNoticeComponent {
  @Input() type: string;

  public form: FormGroup;
  public notice: Notice | null;
  public priority = [
    {
      label: 'High',
      value: 'high'
    },
    {
      label: 'Low',
      value: 'low'
    },
  ]

  private destroy$ = new Subject<void>();
  public editor: Editor;

  constructor(private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { 
      this.form = this.formBuilder.group({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        priority: new FormControl('', [Validators.required])
      });
  }
  
  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditNotice(params['id']))
                      .pipe(mergeMap(() => this.store.select(NoticeState.selectedNotice)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(notice => {
        this.notice = notice;
        this.form.patchValue({
          title: this.notice?.title,
          description: this.notice?.description,
          priority: this.notice?.priority
        });
      });

      this.editor = new Editor();
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateNotice(this.form.value);
    
    if(this.type == 'edit' && this.notice?.id) {
      action = new UpdateNotice(this.form.value, this.notice.id)
    }
    
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { 
            this.router.navigateByUrl('/notice'); 
        }
      });
    }
  }

}

