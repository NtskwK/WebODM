import React from 'react';
import $ from 'jquery';
import '../css/MonitorList.scss';

import MonitorListItem from './MonitorListItem';
import Paginated from './Paginated';
import Paginator from './Paginator';
import ErrorMessage from './ErrorMessage';
import { _, interpolate } from '../classes/gettext';
import PropTypes from 'prop-types';
import Utils from '../classes/Utils';

class MonitorList extends Paginated {
    static propTypes = {
        history: PropTypes.object.isRequired,
    }

    constructor(props){
        super(props);

        console.log(props);
        
        this.state = {
            loading: true,
            refreshing: false,
            error: "",
            projects: [],
            monitors: [],
        }

        this.PROJECTS_PER_PAGE = 10;
        this.MONITORS_PER_PAGE = 10;

        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount(){
        this.refresh();
    }

    getParametersHash(source){
        if (!source) return "";
        if (source.indexOf("?") === -1) return "";

        let search = source.substr(source.indexOf("?"));
        let q = Utils.queryParams({search});
        
        // All parameters that can change via history.push without
        // triggering a reload of the project list should go here
        delete q.project_task_open;
        delete q.project_task_expanded;

        return JSON.stringify(q);
    }

    componentDidUpdate(prevProps){
        if (this.getParametersHash(prevProps.source) !== this.getParametersHash(this.props.source)){
            this.refresh();
        }
    }

    refresh(){
        this.setState({refreshing: true});

        // Load projects from API
        this.serverRequest = 
            $.getJSON(this.props.source, json => {
                if (json.results){
                    this.setState({
                        projects: json.results,
                        loading: false
                    });
                    this.updatePagination(this.PROJECTS_PER_PAGE, json.count);
                }else{
                    this.setState({ 
                        error: interpolate(_("Invalid JSON response: %(error)s"), {error: JSON.stringify(json)}),
                        loading: false
                    });
                }
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                this.setState({ 
                    error: interpolate(_("Could not load projects list: %(error)s"), {error: textStatus}),
                    loading: false
                });
            })
            .always(() => {
                this.setState({refreshing: false});
            });
        
        this.serverRequest2 = 
            $.getJSON("/api/monitors/?project_id=" + this.props.projectId, json => {
                if (json.results){
                    this.setState({
                        monitors: json.results,
                        loading: false
                    });
                    console.log(json.results);
                    this.updatePagination(this.MONITORS_PER_PAGE, json.count);
                }else{
                    this.setState({ 
                        error: interpolate(_("Invalid JSON response: %(error)s"), {error: JSON.stringify(json)}),
                        loading: false
                    });
                }
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                this.setState({ 
                    error: interpolate(_("Could not load monitors list: %(error)s"), {error: textStatus}),
                    loading: false
                });
            })
            .always(() => {
                this.setState({refreshing: false});
            });        
    }

    onPageChanged(pageNum){
        this.refresh();
    }

    componentWillUnmount(){
        this.serverRequest.abort();
    }

    handleDelete(projectId){
        let projects = this.state.projects.filter(p => p.id !== projectId);
        this.setState({projects: projects});
        this.handlePageItemsNumChange(-1, () => {
            this.refresh();
        });

        let monitors = this.state.monitors.filter(p => p.id !== projectId);
        this.setState({monitors: monitors});
        this.handlePageItemsNumChange(-1, () => {
            this.refresh();
        })
    }

    handleTaskMoved = (task) => {
        if (this["projectListItem_" + task.project]){
            this["projectListItem_" + task.project].newTaskAdded();
        }
    }

    handleProjectDuplicated = () => {
        this.refresh();
    }

    render() {
        if (this.state.loading){
            return (<div className="monitor-list text-center"><i className="fa fa-sync fa-spin fa-2x fa-fw"></i></div>);
        }else{
            return (<div className="monitor-list">
                <ErrorMessage bind={[this, 'error']} />
                <Paginator {...this.state.pagination} {...this.props}>
                    <ul key="1" className={"list-group" + (this.state.refreshing ? "refreshing" : "")}>
                        {this.state.projects.map(p => (
                            <MonitorListItem 
                                ref={(domNode) => { this["projectListItem_" + p.id] = domNode }}
                                key={p.id} 
                                data={p} 
                                onDelete={this.handleDelete}
                                onTaskMoved={this.handleTaskMoved}
                                onProjectDuplicated={this.handleProjectDuplicated}
                                history={this.props.history} /> 
                        ))}
                    </ul>
                </Paginator>
            </div>);
        }
    }
}

export default MonitorList;
