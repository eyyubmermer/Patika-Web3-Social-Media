//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Instagram {
    using Counters for Counters.Counter;

    struct Comment {
        string uri;
    }

    struct Post {
        string uri;
        Comment[] comments;
        uint256 likes;
        address sender;
        uint256 postedTime;
    }

    struct User {
        uint256 ID;
        Post[] posts;
        address[] followings;
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
        post.comments.push(comment);
    }

    // function followUser(address _following) public {
    //     users[msg.sender].followings.push(_following);
    // }

    // function viewFollowingsPosts() public returns(Post[] memory)  {
    //     uint len = users[msg.sender].followings.length;
    //     Post[] memory followingPosts;
    //     for(uint i =0; i<len; i++) {
    //         uint len2 = users[users[msg.sender].followings[i]].posts.length;
    //         for(uint i = 0; i < len; i++) {
    //             followingPosts[i] = users[users[msg.sender].followings[i]].posts;
    //         }
    //     }
    //     //return users[msg.sender].followings.posts;
    // }

    // function viewUserFollowings(address _user) public returns(uint[] memory)   {
    //     return users[_user].followings.;
    // }
}
