import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';
import {isSubscribed, isShowWelcome} from '../../helpers/API';
import { URL_PREFIX } from '../../constants/defaultValues'
const AuthRoute = ({ component: Component, isSubscribed, ...rest }) => {

  return (

      <Route
          {...rest}
          render={props =>
              isSubscribed() && !isShowWelcome() ? (
                  <Component {...props} />
              ) : (
                  <Redirect
                      to={{
                        pathname: '/'+URL_PREFIX+'/airline/welcome',
                        state: { from: props.location }
                      }}
                  />
              )
          }
      />
  );
};

const MembershipRoute = ({ component: Component, isSubscribed, ...rest }) => {
  return (

      <Route
          {...rest}
          render={props =>
              !isSubscribed() ? (
                  <Component {...props} />
              ) : (
                  <Redirect
                      to={{
                        pathname: '/'+URL_PREFIX+'/airline/dashboard',
                        state: { from: props.location }
                      }}
                  />
              )
          }
      />
  );
};

const MembershipWelcomRoute = ({ component: Component, isSubscribed, ...rest }) => {
  return (

      <Route
          {...rest}
          render={props =>
              isSubscribed() && isShowWelcome() ? (
                  <Component {...props} />
              ) : (
                  <Redirect
                      to={{
                        pathname: '/'+URL_PREFIX+'/airline/membership',
                        state: { from: props.location }
                      }}
                  />
              )
          }
      />
  );
};


const MembershipPage = React.lazy(() =>
  import('../account/membership')
);

const SubscriptionSuccess = React.lazy(() =>
  import('../account/subscription-success')
);

const BidPage = React.lazy(() =>
  import('./bids')
);

const ChatPage = React.lazy(() =>
  import('./chat')
);

const dashboardPage = React.lazy(() =>
  import('./dashboard')
);

const quotePage = React.lazy(() =>
  import('./quotes')
);

const ViewQuotePage = React.lazy(() =>
  import('../agent/viewQuote')
);

const MakeBidPage = React.lazy(() =>
  import('./makeBid')
);

const ReviewBidPage = React.lazy(() =>
  import('./reviewBids')
);

const UpdateBidPage = React.lazy(() =>
  import('./updateBids')
);

const BidDetailPage = React.lazy(() =>
  import('./bidDetail')
);

const BidInformationPage = React.lazy(() =>
  import('./bidInformation')
);


class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <MembershipRoute
                      path={`${match.url}/membership`}
                      isSubscribed={isSubscribed}
                      component={MembershipPage}
                  />
                  
              <MembershipWelcomRoute
                path={`${match.url}/welcome`}
                isSubscribed={isSubscribed}
                isShowWelcome={isShowWelcome}
                component={SubscriptionSuccess}
              />

              <AuthRoute exact
                path={`${match.url}/quotes`}
                   isSubscribed={isSubscribed}
                   component={quotePage}
              />
              <AuthRoute
                  path={`${match.url}/quotes/:id/view`}
                  isSubscribed={isSubscribed}
                  component={ViewQuotePage}
              />
              <AuthRoute exact
                path={`${match.url}/bids`}
                isSubscribed={isSubscribed}
                component={BidPage}
              />
              <AuthRoute
                path={`${match.url}/quotes/:id/bids/make`}
                isSubscribed={isSubscribed}
                component={MakeBidPage}
              />
              <AuthRoute
                path={`${match.url}/chat`}
                      isSubscribed={isSubscribed}
                render={props => <ChatPage {...props} />}
              />
                <AuthRoute
                    path={`${match.url}/dashboard`}
                    isSubscribed={isSubscribed}
                    component={dashboardPage}
                />

                <AuthRoute
                    path={`${match.url}/quotes/:id/bids/:bid_id/review`}
                    isSubscribed={isSubscribed}
                    component={ReviewBidPage}
                />

                <AuthRoute
                    path={`${match.url}/quotes/:id/bids/:bid_id/update`}
                    isSubscribed={isSubscribed}
                    component={UpdateBidPage}
                />

                 <AuthRoute
                    path={`${match.url}/quotes/:id/bids/:bid_id/detail`}
                    isSubscribed={isSubscribed}
                    component={BidDetailPage}
                />

                <AuthRoute
                    path={`${match.url}/quotes/:id/bids/:bid_id/information`}
                    isSubscribed={isSubscribed}
                    component={BidInformationPage}
                />

              <Redirect to={'/'+URL_PREFIX+"/error"} />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
