import React from "react";
import "../css/EditProjectDialog.scss";
import FormDialog from "./FormDialog";
import PropTypes from "prop-types";
import ErrorMessage from "./ErrorMessage";
import EditPermissionsPanel from "./EditPermissionsPanel";
import { _ } from "../classes/gettext";

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

    data: {
      name: "默认传感器",
      id: -1,
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
    },
  };

  static propTypes = {
    onShow: PropTypes.func,
    title: PropTypes.string,
    saveLabel: PropTypes.string,
    savingLabel: PropTypes.string,
    saveIcon: PropTypes.string,
    deleteWarning: PropTypes.string,
    show: PropTypes.bool,
    showDuplicate: PropTypes.bool,
    showPermissions: PropTypes.bool,
    onDuplicated: PropTypes.func,

    data: PropTypes.object,

    refreshAction: PropTypes.func,
    projectId: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      duplicating: false,
      tags: props.projectTags,
      error: "",
      showTagsField: !!props.projectTags.length,
    };

    this.reset = this.reset.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.onShow = this.onShow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addNewMonitor = this.addNewMonitor.bind(this);
    this.updateMonitor = this.updateMonitor.bind(this);
    this.saveAction = this.saveAction.bind(this);
    this.deleteAction = this.deleteAction.bind(this);
  }

  addNewMonitor(monitor) {
    if (!monitor.name)
      return new $.Deferred().reject(_("Name field is required"));

    return $.ajax({
      url: `/api/monitors/`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(monitor),
    }).done(() => {
      this.props.refreshAction();
    });
  }

  updateMonitor(monitor) {
    console.log(monitor);

    return $.ajax({
      url: `/api/monitors/${monitor.id}/`,
      contentType: "application/json",
      data: JSON.stringify(monitor),
      dataType: "json",
      type: "PUT",
    }).done(() => {
      this.props.refreshAction();
    });
  }

  saveAction(monitor) {
    if (this.props.data.id == -1) {
      return this.addNewMonitor(monitor);
    } else {
      return this.updateMonitor(monitor);
    }
  }

  reset() {
    this.setState({
      name: this.props.data.name,
      duplicating: false,
      error: "",

      id: this.props.data.id,
      project_id: this.props.data.project_id,
      sensor_iden: this.props.data.sensor_iden,
      category_id: this.props.data.category_id,
      point_iden: this.props.data.point_iden,
      point_depth: this.props.data.point_depth,
      extra_channel: this.props.data.extra_channel,
      dtu_id: this.props.data.dtu_id,
      device_code: this.props.data.device_code,
      device_address: this.props.data.device_address,
      channel: this.props.data.channel,
      // monitor_date: this.props.data.monitor_date,
      // init_date: this.props.data.init_date,
      // pos_y: this.props.data.pos_y,
      // pos_x: this.props.data.pos_x,
      // alarm_level: this.props.data.alarm_level,
      raw1_init: this.props.data.raw1_init,
      raw1_last: this.props.data.raw1_last,
      raw2_init: this.props.data.raw2_init,
      raw2_last: this.props.data.raw2_last,
      raw3_init: this.props.data.raw3_init,
      raw3_last: this.props.data.raw3_last,
      med1_init: this.props.data.med1_init,
      med1_last: this.props.data.med1_last,
      med2_init: this.props.data.med2_init,
      med2_last: this.props.data.med2_last,
      med3_init: this.props.data.med3_init,
      med3_last: this.props.data.med3_last,
      med4_init: this.props.data.med4_init,
      med4_last: this.props.data.med4_last,
      res1_init: this.props.data.res1_init,
      res1_last: this.props.data.res1_last,
      res2_init: this.props.data.res2_init,
      res2_last: this.props.data.res2_last,
      res3_init: this.props.data.res3_init,
      res3_last: this.props.data.res3_last,
      res4_init: this.props.data.res4_init,
      res4_last: this.props.data.res4_last,
    });

    if (this.props.projectId){
      this.setState({projectId: this.props.projectId});
    }
  }

  getFormData() {
    const res = {
      name: this.state.name,
      id: this.state.id,
      project_id: this.state.projectId,
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
    this.duplicateRequest = $.post(`/api/monitors/${this.props.id}/duplicate/`)
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

  deleteAction() {
    return $.ajax({
      url: `/api/monitors/${this.props.data.id}/`,
      type: "DELETE",
    }).done(() => {
      this.props.refreshAction();
    });
  }

  toggleTagsField = () => {
    if (!this.state.showTagsField) {
      setTimeout(() => {
        if (this.tagsField) this.tagsField.focus();
      }, 0);
    }
    this.setState({ showTagsField: !this.state.showTagsField });
  };

  render() {
    return (
      <FormDialog
        {...this.props}
        getFormData={this.getFormData}
        reset={this.reset}
        onShow={this.onShow}
        saveAction={this.saveAction}
        deleteAction={this.props.data.id != -1 ? this.deleteAction : undefined}
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
              onChange={this.handleChange("name")}
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
        {this.props.showPermissions ? (
          <EditPermissionsPanel
            projectId={this.props.project_id}
            lazyLoad={true}
            ref={(domNode) => {
              this.editPermissionsPanel = domNode;
            }}
          />
        ) : (
          ""
        )}

        {this.props.data.id != -1 ? (
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
                  onChange={this.handleChange("project_id")}
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
        ) : (
          ""
        )}
      </FormDialog>
    );
  }
}

export default MonitorDialog;
