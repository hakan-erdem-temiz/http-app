import React, { Component } from "react";
import "./App.css";
import http from "./services/httpService";
import config from "./config.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExampleBoundary from "./services/ExampleBoundary";

class App extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    const { data: posts } = await http.get(config.apiEndpoint);
    this.setState({ posts });
  }

  handleAdd = async () => {
    const obj = { title: "hakan erdem", body: "temiz  " };
    const { data: post } = await http.post(config.apiEndpoint, obj);

    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async post => {
    post.title = "UPDATED by HET";
    await http.put(config.apiEndpoint + "/" + post.id, post); //to update all datpropertya
    //http.patch(config.apiEndpoint + "/" + post.id, { title: post.title }); // to update one or more property

    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = { ...post };
    this.setState({ posts });
  };

  handleDelete = async post => {
    //this is pessimictic way. First get await then render
    // await http.delete(config.apiEndpoint + "/" + post.id);

    // const posts = this.state.posts.filter(p => p.id !== post.id);
    // this.setState({ posts });

    //this is optimistic way. First render then get await
    const originalPosts = this.state.posts;

    const posts = this.state.posts.filter(p => p.id !== post.id);
    this.setState({ posts });

    try {
      await http.delete("s" + config.apiEndpoint + "/" + post.id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        console.log("LOgging the error", ex.error);
        alert("This post has already been deleted !");
      }
      //else { //i use interceptor instead of else
      //   console.log("Logging the error");
      //   alert("Something failed while deleting a post!");
      // }
      this.setState({ post: originalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
