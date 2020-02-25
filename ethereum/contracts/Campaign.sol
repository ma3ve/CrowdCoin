pragma solidity >=0.4.22 <0.7.0;

contract Factory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 min) public {
        address newCampaign = address(new Campaign(min, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 totalApprovals;
        mapping(address => bool) approved;
    }

    Request[] public requests;

    address public manager;

    uint256 public minimumContribution;

    uint256 public totalContributors;

    uint256 public totalContibutions;

    mapping(address => bool) contributor;
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 min, address _manager) public {
        manager = _manager;
        minimumContribution = min;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        contributor[msg.sender] = true;
        totalContributors += 1;
        totalContibutions += msg.value;
    }

    function createRequest(
        string memory _description,
        uint256 _value,
        address payable _recipient
    ) public restricted {
        Request memory request = Request({
            description: _description,
            value: _value,
            recipient: _recipient,
            complete: false,
            totalApprovals: 0
        });
        requests.push(request);
    }

    function approverequest(uint256 index) public {
        require(contributor[msg.sender]);
        require(!requests[index].approved[msg.sender]);
        requests[index].approved[msg.sender] = true;
        requests[index].totalApprovals++;
    }

    function finalizerequest(uint256 index) public restricted {
        require(requests[index].totalApprovals > (totalContributors / 2));
        require(!requests[index].complete);
        requests[index].recipient.transfer(requests[index].value);
        requests[index].complete = true;

    }

    function getsummary()
        public
        view
        returns (uint256, uint256, uint256, uint256, address)
    {
        return (
            minimumContribution,
            address(this).balance,
            totalContributors,
            requests.length,
            manager
        );
    }
    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }

}
