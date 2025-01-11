import { Component, Inject, Renderer2, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetQuestionAnswers, DeleteQuestionAnswers, 
        DeleteAllQuestionAnswers } from '../../shared/action/questions-answers.action';
import { Stores } from '../../shared/interface/store.interface';
import { TableClickedAction, TableConfig } from '../../shared/interface/table.interface';
import { QuestionAnswersState } from '../../shared/state/questions-answers.state';
import { AnswersModalComponent } from './answers-modal/answers-modal.component';
import { QnAModel, QuestionAnswers } from '../../shared/interface/questions-answers.interface';
import { DOCUMENT } from '@angular/common';
import { Params } from '../../shared/interface/core.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-questions-answers',
  templateUrl: './questions-answers.component.html',
  styleUrls: ['./questions-answers.component.scss']
})
export class QuestionsAnswersComponent {

  @Select(QuestionAnswersState.questionAnswers) questionAnswers$: Observable<QnAModel>;
  
  @ViewChild("answersModal") AnswersModal: AnswersModalComponent;

  public total: number;
  public selectedStatus: string;
  public filter: Params = {}
  public tableConfig: TableConfig = {
    columns: [
      { title: "Question", dataField: "question" },
      { title: "product", dataField: "product_name" },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "status", dataField: "status",sortable: true, sort_direction: 'desc' },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "store.edit"  },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "store.destroy"  },
    ],
    data: [] as QuestionAnswers[], 
    total: 0
  };

  constructor(private store: Store, private renderer: Renderer2, 
    private router: Router, private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.questionAnswers$.subscribe(questionAnswers => { 
      this.total = questionAnswers.total;
      let questions = questionAnswers.data.filter(element => {
        element.product_name = element.product.name;
        element.status = element?.answer ? `<div class="status-approved"><span>Repelled</span></div>` : `<div class="status-pending"><span>Pending</span></div>`;
        return element;
      })
      this.tableConfig.data  = questions ? questions : [];
      this.tableConfig.total = questionAnswers && questionAnswers?.total ? questionAnswers?.total : 0;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.filter = {...this.filter, status : params['status'] ? params['status'] : ''};
      this.selectedStatus = params['status'];
      this.store.dispatch(new GetQuestionAnswers(this.filter));
    })
  }

  onTableChange(data?: Params) {
    const status = this.selectedStatus ? this.selectedStatus : '';
    this.filter = { ...this.filter, ...data}
    this.filter['status'] = status;
    this.store.dispatch(new GetQuestionAnswers(this.filter));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.AnswersModal.openModal(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  filterOrder(status: string) { 
    this.renderer.addClass(this.document.body, 'loader-none');
    this.router.navigate([], {
      queryParams: {
        'status': status ? status : null,
      },
      queryParamsHandling: 'merge'
    });
  }

  delete(data: Stores) {
    this.store.dispatch(new DeleteQuestionAnswers(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllQuestionAnswers(ids));
  }

}
