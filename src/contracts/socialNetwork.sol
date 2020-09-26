pragma solidity ^0.5.0;

contract SocialNetwork {
    uint public postCount = 0;
    mapping(uint => Post) public posts;
    string public name;

    struct Post{
        uint id;
        string content;
        uint tipAmount;
        address payable author;
    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    constructor() public {
        name = "Mastermind Social Network";
    }

    function createPost(string memory _content) public {
        //Require valid content
        require(bytes(_content).length > 0);
        //increment the post count
        postCount++;
        //Create the post
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        // Trigger event
        emit PostCreated(postCount, _content, 0, msg.sender);

    }

    function tipPost(uint _id) public payable{
        //Make sure the id is valid
        require(_id > 0 && _id <= postCount); 
        //Fetch the post
        Post memory _post = posts[_id];
        //Fetch the author
        address payable _author = _post.author;
        //Pay the author
        //address(_author).transfer(msg.value);
        //increment the tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        //update the post
        posts[_id] = _post;
        //Trigger an event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }
 
}