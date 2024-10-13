import React from "react";
import "../css/EditProjectDialog.scss";
import FormDialog from "./FormDialog";
import PropTypes from "prop-types";
import ErrorMessage from "./ErrorMessage";
import EditPermissionsPanel from "./EditPermissionsPanel";
import TagsField from "./TagsField";
import { _ } from "../classes/gettext";

class YcProjectDialog extends React.Component {
  static defaultProps = {
    projectName: "",
    projectDescr: "",
    projectId: -1,
    projectTags: [],
    title: _("项目信息"),
    saveLabel: _("保存信息"),
    savingLabel: _("正在提交..."),
    saveIcon: "glyphicon glyphicon-plus",
    deleteWarning: "",
    show: false,
    showDuplicate: false,
    showPermissions: false,
    onDuplicated: () => {},
    ycAddress: "",
    ycInfo: "",
    ycLat: 0,
    ycLng: 0,
    ycMonitorBase: "",
    ycMonitorRateInfo: "",
    ycTags: [],
  };

  static propTypes = {
    projectName: PropTypes.string,
    projectDescr: PropTypes.string,
    projectId: PropTypes.number,
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
    ycAddress: PropTypes.string,
    ycInfo: PropTypes.string,
    ycLat: PropTypes.number,
    ycLng: PropTypes.number,
    ycMonitorBase: PropTypes.string,
    ycMonitorRateInfo: PropTypes.string,
    ycTags: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: props.projectName,
      id: props.projectId,
      descr: props.projectDescr !== null ? props.projectDescr : "",
      duplicating: false,
      tags: props.projectTags,
      error: "",
      showTagsField: !!props.projectTags.length,
      ycAddress: "",
      ycInfo: "",
      ycLat: 0,
      ycLng: 0,
      ycMonitorBase: "",
      ycMonitorRateInfo: "",
      ycTags: [],
    };

    this.reset = this.reset.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.onShow = this.onShow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveAction = this.saveAction.bind(this);
  }

  reset() {
    this.setState({
      name: this.props.projectName,
      descr: this.props.projectDescr,
      duplicating: false,
      tags: this.props.projectTags,
      showTagsField: !!this.props.projectTags.length,
      error: "",
      ycAddress: "",
      ycInfo: "",
      ycLat: 0,
      ycLng: 0,
      ycMonitorBase: "",
      ycMonitorRateInfo: "",
      ycTags: [],
    });
  }

  // Send data of form to server
  getFormData() {

    const res = {
      ycAddress: this.state.ycAddress,
      ycInfo: this.state.ycInfo,
      ycLat: this.state.ycLat,
      ycLng: this.state.ycLng,
      YcMonitorBase: this.state.ycMonitorBase,
      YcMonitorRateInfo: this.state.YcMonitorRateInfo,
    };

    if (this.editPermissionsPanel) {
      res.permissions = this.editPermissionsPanel.getPermissions();
    }

    return res;
  }

  onShow() {
    // fetch data of instance
    $.getJSON(`/api/yc/${this.state.id}/`)
      .done((data) => {
        this.setState({
          ycAddress: data.address,
          ycInfo: data.info,
          ycLat: data.lat,
          ycLng: data.lng,
          ycMonitorBase: data.monitor_base,
          ycMonitorRateInfo: data.monitor_rate_info,
        });
      })
      .fail((_, __, e) => {
        this.setState({ error: e.message });
      })
      .always(() => {
        this.setState({ refreshing: false });
      });
    
    // if (this.editPermissionsPanel) this.editPermissionsPanel.loadPermissions();
    // this.nameInput.focus();
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

  saveAction(ycProject) {
    return $.ajax({
      url: `/api/yc/${this.state.id}/`,
      contentType: 'application/json',
      data: JSON.stringify({
        // name: ycProject.name,
        // identifys: ycProject.identify,
        address: ycProject.ycAddress,
        info: ycProject.ycInfo,
        lat: ycProject.ycLat,
        lng: ycProject.ycLng,
        monitorBase: ycProject.monitorBase,
        monitorRateInfo: ycProject.monitorRateInfo,
      }),
      dataType: 'json',
      type: 'PUT'
    }).done(() => {
      console.log(ycProject);
      console.log(ycProject.ycAddress);
      
      // do nothing
    });
  }

  render() {
    let tagsField = "";
  
    tagsField = (
      <div className="form-group">
        <label className="col-sm-2 control-label">{_("Tags")}</label>
        <i className="fa fa-tag"></i>
        <div className="col-sm-10">
          <TagsField
            onUpdate={(tags) => (this.state.tags = tags)}
            tags={this.state.tags}
            ref={(domNode) => (this.tagsField = domNode)}
          />
        </div>
      </div>
    );


    return (
      <FormDialog
        {...this.props}
        getFormData={this.getFormData}
        saveAction={this.saveAction}
        reset={this.reset}
        onShow={this.onShow}
        leftButtons={undefined}
        ref={(domNode) => {
          this.dialog = domNode;
        }}
      >
        <ErrorMessage bind={[this, "error"]} />
        {/* <div className="form-group edit-project-dialog"> */}
        <div className="form-group">
          <label className="col-sm-3 text-right">
            {_("Name")}:
          </label>
          <div className="col-sm-9">
            {this.state.name}
          </div>

          {/* <div className="col-sm-8 name-fields align-items-center">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.name}
              onChange={this.handleChange("name")}
              onKeyPress={(e) => this.dialog.handleEnter(e)}
            />
          </div> */}
        </div>
        {/* {tagsField} */}
        <div className="form-group">
          <label className="col-sm-3 text-right">
            {"地址:"}
          </label>
          <div className="col-sm-9 align-items-center">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.ycAddress}
              onChange={this.handleChange("ycAddress")}
              onKeyPress={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-3 text-right">
            {"监控基准:"}
          </label>
          <div className="col-sm-9 align-items-center">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.ycMonitorBase}
              onChange={this.handleChange("ycMonitorBase")}
              onKeyPress={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-3 text-right">
            {"监控频率:"}
          </label>
          <div className="col-sm-9 align-items-center">
            <input
              type="text"
              className="form-control"
              ref={(domNode) => {
                this.nameInput = domNode;
              }}
              value={this.state.ycMonitorRateInfo}
              onChange={this.handleChange("ycMonitorRateInfo")}
              onKeyPress={(e) => this.dialog.handleEnter(e)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-sm-3 text-right">
            {"信息:"}
          </label>
          <div className="col-sm-9">
            <textarea
                className="form-control"
                rows="3"
                value={this.state.ycInfo}
                onChange={this.handleChange("ycInfo")}
              />
          </div>
        </div>
      </FormDialog>
    );
  }
}

export default YcProjectDialog;
