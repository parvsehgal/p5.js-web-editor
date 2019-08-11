import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory, Link } from 'react-router';
import { Helmet } from 'react-helmet';
import { updateSettings, initiateVerification, createApiKey, removeApiKey } from '../actions';
import NavBasic from '../../../components/NavBasic';

import AssetList from '../../IDE/components/AssetList';
import SketchList from '../../IDE/components/SketchList';

import DashboardTabSwitcher, { TabKey } from '../components/DashboardTabSwitcher';

class DashboardView extends React.Component {
  static defaultProps = {
    user: null,
  };

  constructor(props) {
    super(props);
    this.closeAccountPage = this.closeAccountPage.bind(this);
    this.gotoHomePage = this.gotoHomePage.bind(this);
  }

  componentDidMount() {
    document.body.className = this.props.theme;
  }

  closeAccountPage() {
    browserHistory.push(this.props.previousPath);
  }

  gotoHomePage() {
    browserHistory.push('/');
  }

  selectedTabName() {
    const path = this.props.location.pathname;

    if (/assets/.test(path)) {
      return TabKey.assets;
    }

    return TabKey.sketches;
  }

  ownerName() {
    if (this.props.params.username) {
      return this.props.params.username;
    }

    return this.props.user.username;
  }

  isOwner() {
    return this.props.user.username === this.props.params.username;
  }

  navigationItem() {

  }

  render() {
    const currentTab = this.selectedTabName();
    const isOwner = this.isOwner();
    const { username } = this.props.params;

    return (
      <div className="dashboard">
        <Helmet>
          <title>p5.js Web Editor | Account</title>
        </Helmet>

        <NavBasic onBack={this.closeAccountPage} />

        <section className="dashboard-header">
          <div className="dashboard-header__header">
            <h2 className="dashboard-header__header__title">{this.ownerName()}</h2>

            <DashboardTabSwitcher currentTab={currentTab} isOwner={isOwner} username={username} />
          </div>
          
          <div className="dashboard-content">
            {
              currentTab === TabKey.sketches ? <SketchList username={username} /> : <AssetList username={username} />
            }
          </div>
        </section>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    previousPath: state.ide.previousPath,
    user: state.user,
    theme: state.preferences.theme
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSettings, initiateVerification, createApiKey, removeApiKey
  }, dispatch);
}

DashboardView.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  previousPath: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
