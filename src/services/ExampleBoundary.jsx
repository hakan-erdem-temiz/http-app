import React, { Component } from "react";
import * as Sentry from "@sentry/browser";

// Sentry.init({
//  dsn: "https://88cbaa3aadb24bd29678485176b8f9c3@sentry.io/1381928"
// });
// should have been called before using it here
// ideally before even rendering your react app

class ExampleBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      return <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>;
    } else {
      //when there's not an error, render children untouched
      return "this.props.children";
    }
  }
}

export default ExampleBoundary;
