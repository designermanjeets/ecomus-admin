import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Blog, BlogModel } from "../../shared/interface/blog.interface";
import { BlogState } from '../../shared/state/blog.state';
import { GetBlogs, UpdateBlogStatus, DeleteBlog, DeleteAllBlog } from '../../shared/action/blog.action';
import { SettingState } from '../../shared/state/setting.state';
import { Values } from '../../shared/interface/setting.interface';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {

  @Select(BlogState.blog) blog$: Observable<BlogModel>;

  @Select(SettingState.setting) setting$: Observable<Values>;

  public url: string;

  public tableConfig: TableConfig = {
    columns: [
      { title: "title", dataField: "title", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "blog.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "blog.destroy" },
      { label: "View", actionToPerform: "view", icon: "ri-eye-line" }
    ],
    data: [] as Blog[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { 
    this.setting$.subscribe(setting => {
      this.url = setting.general.site_url;
    });
  }

  ngOnInit() {
    this.blog$.subscribe(blog => { 
      this.tableConfig.data  = blog ? blog?.data  : [];
      this.tableConfig.total = blog ? blog?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetBlogs(data)).subscribe();
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'status')
      this.status(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
    else if(action.actionToPerform == 'view')
      this.view(action.data)
  }

  edit(data: Blog) {
    this.router.navigateByUrl(`/blog/edit/${data.id}`);
  }

  status(data: Blog) {
    this.store.dispatch(new UpdateBlogStatus(data.id, data.status))
  }

  delete(data: Blog) {
    this.store.dispatch(new DeleteBlog(data.id))
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllBlog(ids))
  }

  view(data: Blog) {
    window.open(this.url+'/blog/'+data.slug, "_blank");
  }

}
