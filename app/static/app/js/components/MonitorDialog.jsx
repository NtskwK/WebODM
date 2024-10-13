import React from "react";
import "../css/EditProjectDialog.scss";
import FormDialog from "./FormDialog";
import PropTypes from "prop-types";
import ErrorMessage from "./ErrorMessage";
import EditPermissionsPanel from "./EditPermissionsPanel";
import TagsField from "./TagsField";
import { _ } from "../classes/gettext";
import MonitorList from './MonitorList';

class MonitorDialog extends React.Component {
  static defaultProps = {
    projectDescr: "",
    projectTags: [],
    title: _("添加传感器"),
    saveLabel: _("添加传感器"),
    savingLabel: _("正在添加..."),
    saveIcon: "glyphicon glyphicon-plus",
    deleteWarning: "",
    show: false,
    showDuplicate: false,
    showPermissions: false,
    onDuplicated: () => {},

    monitorName: "默认传感器",
    monitorId: -1,
    projectId: -1,
    valid_id: 0,
    sensor_iden: "",
    category_id: "",
    pos_y: 0,
    pos_x: 0,
    point_iden: "",
    point_depth: 0,
    monitor_date: "",
    init_date: "",
    extra_channel: 0,
    dtu_id: 0,
    device_code: "",
    device_address: "",
    channel: 0,
    alarm_level: 0,
    raw1_init: 0,
    raw1_last: 0,
    raw2_init: 0,
    raw2_last: 0,
    raw3_init: 0,
    raw3_last: 0,
    med1_init: 0,
    med1_last: 0,
    med2_init: 0,
    med2_last: 0,
    med3_init: 0,
    med3_last: 0,
    med4_init: 0,
    med4_last: 0,
    res1_init: 0,
    res1_last: 0,
    res2_init: 0,
    res2_last: 0,
    res3_init: 0,
    res3_last: 0,
    res4_init: 0,
    res4_last: 0,
  };

  static propTypes = {
    projectName: PropTypes.string,
    projectDescr: PropTypes.string,
    projectTags: PropTypes.array,
    onShow: PropTypes.func,
    deleteAction: PropTypes.func,
    title: PropTypes.string,
    saveLabel: PropTypes.string,
    savingLabel: PropTypes.string,
    saveIcon: PropTypes.string,
    deleteWarning: PropTypes.string,
    show: PropTypes.bool,
    showDuplicate: PropTypes.bool,
    showPermissions: PropTypes.bool,
    onDuplicated: PropTypes.func,

    monitorName: PropTypes.string,
    projectId: PropTypes.number,
    monitorId: PropTypes.number,
    valid_id: PropTypes.number,
    sensor_iden: PropTypes.string,
    category_id: PropTypes.string,
    pos_y: PropTypes.number,
    pos_x: PropTypes.number,
    point_iden: PropTypes.string,
    point_depth: PropTypes.number,
    monitor_date: PropTypes.string,
    init_date: PropTypes.string,
    extra_channel: PropTypes.number,
    dtu_id: PropTypes.number,
    device_code: PropTypes.string,
    device_address: PropTypes.string,
    channel: PropTypes.number,
    alarm_level: PropTypes.number,
    raw1_init: PropTypes.number,
    raw1_last: PropTypes.number,
    raw2_init: PropTypes.number,
    raw2_last: PropTypes.number,
    raw3_init: PropTypes.number,
    raw3_last: PropTypes.number,
    med1_init: PropTypes.number,
    med1_last: PropTypes.number,
    med2_init: PropTypes.number,
    med2_last: PropTypes.number,
    med3_init: PropTypes.number,
    med3_last: PropTypes.number,
    med4_init: PropTypes.number,
    med4_last: PropTypes.number,
    res1_init: PropTypes.number,
    res1_last: PropTypes.number,
    res2_init: PropTypes.number,
    res2_last: PropTypes.number,
    res3_init: PropTypes.number,
    res3_last: PropTypes.number,
    res4_init: PropTypes.number,
    res4_last: PropTypes.number,

    refreshAction: PropTypes.func,
  };

  constructor(props) {
    super(props);
    
    this.state = {
      descr: props.projectDescr !== null ? props.projectDescr : "",
      duplicating: false,
      tags: props.projectTags,
      error: "",
      showTagsField: !!props.projectTags.length,

      name: props.monitorName,
      projectId: props.projectId,
      monitorId: props.monitorId,
      valid_id: props.valid_id,
      sensor_iden: props.sensor_iden,
      category_id: props.category_id,
      pos_y: props.pos_y,
      pos_x: props.pos_x,
      point_iden: props.point_iden,
      point_depth: props.point_depth,
      monitor_date: props.monitor_date,
      init_date: props.init_date,
      extra_channel: props.extra_channel,
      dtu_id: props.dtu_id,
      device_code: props.device_code,
      device_address: props.device_address,
      channel: props.channel,
      alarm_level: props.alarm_level,
      raw1_init: props.raw1_init,
      raw1_last: props.raw1_last,
      raw2_init: props.raw2_init,
      raw2_last: props.raw2_last,
      raw3_init: props.raw3_init,
      raw3_last: props.raw3_last,
      med1_init: props.med1_init,
      med1_last: props.med1_last,
      med2_init: props.med2_init,
      med2_last: props.med2_last,
      med3_init: props.med3_init,
      med3_last: props.med3_last,
      med4_init: props.med4_init,
      med4_last: props.med4_last,
      res1_init: props.res1_init,
      res1_last: props.res1_last,
      res2_init: props.res2_init,
      res2_last: props.res2_last,
      res3_init: props.res3_init,
      res3_last: props.res3_last,
      res4_init: props.res4_init,
      res4_last: props.res4_last,

    };

    this.reset = this.reset.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.onShow = this.onShow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addNewMonitor = this.addNewMonitor.bind(this);
    this.updateMonitor = this.updateMonitor.bind(this);
    this.saveAction = this.saveAction.bind(this);
    console.log(props);
    
  }

  addNewMonitor(monitor){
    if (!monitor.name) return (new $.Deferred()).reject(_("Name field is required"));

    return $.ajax({
      url: `/api/monitors/`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(monitor)
    }).done(() => {
      this.props.refreshAction()
    });
  }
  
  updateMonitor(monitor){
    return $.ajax({
        url: `/api/projects/${this.state.monitorId}/`,
        contentType: 'application/json',
        data: JSON.stringify({
          name: monitor.name,
          description: monitor.descr,
          tags: monitor.tags,
          permissions: monitor.permissions
        }),
        dataType: 'json',
        type: 'POST'
      }).done(() => {
        this.refresh();
      });
  }
  
  saveAction(monitor){
    if (this.state.monitorId === -1) {
      return this.addNewMonitor(monitor);
    }
    else {
      return this.updateMonitor(monitor);
    }
  }

  reset() {
    this.setState({
      name: this.props.projectName,
      descr: this.props.projectDescr,
      duplicating: false,
      tags: this.props.projectTags,
      showTagsField: !!this.props.projectTags.length,
      error: "",

    monitorName: "默认传感器",
    monitorId: -1,
    projectId: -1,
    valid_id: 0,
    sensor_iden: "",
    category_id: "",
    pos_y: 0,
    pos_x: 0,
    point_iden: "",
    point_depth: 0,
    monitor_date: "",
    init_date: "",
    extra_channel: 0,
    dtu_id: 0,
    device_code: "",
    device_address: "",
    channel: 0,
    alarm_level: 0,
    raw1_init: 0,
    raw1_last: 0,
    raw2_init: 0,
    raw2_last: 0,
    raw3_init: 0,
    raw3_last: 0,
    med1_init: 0,
    med1_last: 0,
    med2_init: 0,
    med2_last: 0,
    med3_init: 0,
    med3_last: 0,
    med4_init: 0,
    med4_last: 0,
    res1_init: 0,
    res1_last: 0,
    res2_init: 0,
    res2_last: 0,
    res3_init: 0,
    res3_last: 0,
    res4_init: 0,
    res4_last: 0,
    });
  }

  getFormData() {
    const res = {
      name: this.state.monitorName,
      project_id: this.props.projectId,
      sensor_iden: this.state.sensor_iden,
      category_id: this.state.category_id,
      // pos_y: this.state.pos_y,
      // pos_x: this.state.pos_x,
      point_iden: this.state.point_iden,
      point_depth: this.state.point_depth,
      // monitor_date: this.state.monitor_date,
      // init_date: this.state.init_date,
      extra_channel: this.state.extra_channel,
      dtu_id: this.state.dtu_id,
      device_code: this.state.device_code,
      device_address: this.state.device_address,
      channel: this.state.channel,
      // alarm_level: this.state.alarm_level,
    };

    if (this.editPermissionsPanel) {
      res.permissions = this.editPermissionsPanel.getPermissions();
    }

    return res;
  }

  onShow() {
    if (this.editPermissionsPanel) this.editPermissionsPanel.loadPermissions();
    this.nameInput.focus();
  }

  show() {
    this.dialog.show();
  }

  hide() {
    this.dialog.hide();

    if (this.duplicateRequest) {
      this.duplicateRequest.abort();
      this.duplicateRequest = null;
    }
  }

  handleChange(field) {
    return (e) => {
      let state = {};
      state[field] = e.target.value;
      this.setState(state);
    };
  }

  handleDuplicate = () => {
    this.setState({ duplicating: true });
    this.duplicateRequest = $.post(
      `/api/projects/${this.props.projectId}/duplicate/`
    )
      .done((json) => {
        if (json.success) {
          this.hide();
          this.props.onDuplicated(json.project);
        } else {
          this.setState({
            error: json.error || _("Cannot complete operation."),
          });
        }
      })
      .fail(() => {
        this.setState({
          error: _("Cannot complete operation."),
        });
      })
      .always(() => {
        this.setState({ duplicating: false });
        this.duplicateRequest = null;
      });
  };

  toggleTagsField = () => {
    if (!this.state.showTagsField) {
      setTimeout(() => {
        if (this.tagsField) this.tagsField.focus();
      }, 0);
    }
    this.setState({ showTagsField: !this.state.showTagsField });
  };

  render() {
    let tagsField = "";
    let editPanel = "";
    if (this.state.monitorId != -1){
      editPanel = (
        <div>
          <div className="form-group edit-project-dialog">
            <label className="col-sm-3 control-label">{_("所属项目")}</label>
            <div className="col-sm-9 name-fields">
              <input
                type="text"
                className="form-control"
                ref={(domNode) => {
                  this.nameInput = domNode;
                }}
                value={this.state.projectId}
                onChange={this.handleChange("projectId")}
                onKeyDown={(e) => this.dialog.handleEnter(e)}
              />
            </div>
            </div>
          <div className="form-group edit-project-dialog">
            <label className="col-sm-3 control-label">{_("监测日期")}</label>
            <div className="col-sm-9 name-fields">
              <input
                type="text"
                className="form-control"
                ref={(domNode) => {
                  this.nameInput = domNode;
                }}
                value={this.state.monitor_date}
                onChange={this.handleChange("monitor_date")}
                onKeyDown={(e) => this.dialog.handleEnter(e)}
              />
            </div>
          </div>
          <div className="form-group edit-project-dialog">
            <label className="col-sm-3 control-label">{_("初始日期")}</label>
            <div className="col-sm-9 name-fields">
              <input
                type="text"
                className="form-control"
                ref={(domNode) => {
                  this.nameInput = domNode;
                }}
                value={this.state.init_date}
                onChange={this.handleChange("init_date")}
                onKeyDown={(e) => this.dialog.handleEnter(e)}
              />
            </div>
          </div>
        </div>
        
      );
    }

    if (this.state.showTagsField) {
      tagsField = (
        <div className="form-group">
          <label className="col-sm-2 control-label">{_("Tags")}</label>
          <div className="col-sm-10">
            <TagsField
              onUpdate={(tags) => (this.state.tags = tags)}
              tags={this.state.tags}
              ref={(domNode) => (this.tagsField = domNode)}
            />
          </div>
        </div>
      );
    }

    return (
      <FormDialog
        {...this.props}
        getFormData={this.getFormData}
        reset={this.reset}
        onShow={this.onShow}
        saveAction={this.saveAction}
        leftButtons={
          this.props.showDuplicate
            ? [
                <button
                  key="duplicate"
                  disabled={this.duplicating}
                  onClick={this.handleDuplicate}
                  className="btn btn-default"
                >
                  <i
                    className={
                      "fa " +
                      (this.state.duplicating
                        ? "fa-circle-notch fa-spin fa-fw"
                        : "fa-copy")
                    }
                  ></i>
                  <span className="hidden-xs"> {_("Duplicate")}</span>
                </button>,
              ]
            : undefined
        }
        ref={(domNode) => {
          this.dialog = domNode;
        }}
      >
        <ErrorMessage bind={[this, "error"]} />
        <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("Name")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.name}
              onChange={this.handleChange("monitorName")}
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("传感器标识")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.sensor_iden}
              onChange={this.handleChange("sensor_iden")}
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("监测类别")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.category_id}
              onChange={this.handleChange("category_id")}
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        {/* <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("位置Y")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.pos_y}
              onChange={this.handleChange("pos_y")} 
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("位置X")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.pos_x}
              onChange={this.handleChange("pos_x")}
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div> */}
        <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("监测点标识")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.point_iden}
              onChange={this.handleChange("point_iden")}
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("监测点深度")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.point_depth}
              onChange={this.handleChange("point_depth")}
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("额外通道")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.extra_channel}
              onChange={this.handleChange("extra_channel")}
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("DTU标识")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.dtu_id}
              onChange={this.handleChange("dtu_id")}
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("设备编码")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.device_code}
              onChange={this.handleChange("device_code")}
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("设备地址")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.device_address}
              onChange={this.handleChange("device_address")}
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        <div className="form-group edit-project-dialog">
          <label className="col-sm-3 control-label">{_("通道")}</label>
          <div className="col-sm-9 name-fields">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.channel}
              onChange={this.handleChange("channel")}
              onKeyDown={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        {editPanel}
        {this.props.showPermissions ? (
          <EditPermissionsPanel
            projectId={this.props.projectId}
            lazyLoad={true}
            ref={(domNode) => {
              this.editPermissionsPanel = domNode;
            }}
          />
        ) : (
          ""
        )}
      </FormDialog>
    );
  }
}

export default MonitorDialog;
