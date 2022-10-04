//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Instagram {
    using Counters for Counters.Counter;

    struct Comment {
        string uri;
        address sender;
    }

    struct Post {
        uint256 ID;
        string uri;
        Comment[] comments;
        uint256 likes;
        address sender;
        uint256 postedTime;
    }

    struct User {
        uint256 ID;
        Post[] posts;
        string uri;
    }

    mapping(address => User) public users;
    mapping(uint256 => Post) public posts;

    Post[] public allPosts;

    Counters.Counter private postCounter;

    function sendPost(string memory _uri) public {
        Post storage post = posts[postCounter.current()];
        post.uri = _uri;
        post.sender = msg.sender;
        post.postedTime = block.timestamp;
        post.ID = postCounter.current();
        users[msg.sender].posts.push(post);
        allPosts.push(post);
        postCounter.increment();
    }

    function viewAllPosts() public view returns (Post[] memory) {
        return allPosts;
    }

    function sendComment(uint256 _postId, string memory _uri) public {
        Post storage post = posts[_postId];
        Comment memory comment;
        comment.uri = _uri;
        comment.sender = msg.sender;
        post.comments.push(comment);
        allPosts[_postId] = post;
    }

    function editProfile(string memory _uri) public {
        users[msg.sender].uri = _uri;
    }

    function viewUser(address _userAddress) public view returns (User memory) {
        return users[_userAddress];
    }

    function viewPost(uint256 _postId) public view returns (Post memory) {
        return posts[_postId];
    }

    function likePost(uint256 _postId) public {
        posts[_postId].likes++;
    }
}
