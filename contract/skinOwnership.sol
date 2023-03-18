pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkinMarketplace is ERC721, Ownable {
    
    struct Skin {
        address owner;
        uint256 price;
        uint256 previousOwners;
    }
    
    Skin[] public skins;
    
    mapping (uint256 => address) public skinToOwner;
    mapping (address => uint256) public ownerToSkinCount;
    
    event SkinCreated(uint256 indexed _skinId, address indexed _owner, uint256 _price, uint256 _previousOwners);
    event SkinTransferred(address indexed _from, address indexed _to, uint256 indexed _skinId);
    event SkinPriceModified(uint256 indexed _skinId, uint256 _newPrice);
    
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}
    
    function createSkin(address _owner, uint256 _price, uint256 _previousOwners) external onlyOwner returns (uint256) {
        Skin memory newSkin = Skin({
            owner: _owner,
            price: _price,
            previousOwners: _previousOwners
        });
        
        skins.push(newSkin);
        
        uint256 newSkinId = skins.length - 1;
        skinToOwner[newSkinId] = _owner;
        ownerToSkinCount[_owner]++;
        
        emit SkinCreated(newSkinId, _owner, _price, _previousOwners);
        
        return newSkinId;
    }
    
    function transferSkin(address _from, address _to, uint256 _skinId) external {
        require(skinToOwner[_skinId] == _from, "You don't own this skin.");
        require(ownerOf(_skinId) == _from, "Invalid owner.");
        
        skinToOwner[_skinId] = _to;
        ownerToSkinCount[_from]--;
        ownerToSkinCount[_to]++;
        
        emit SkinTransferred(_from, _to, _skinId);
        
        _transfer(_from, _to, _skinId);
    }
    
    function modifySkinPrice(uint256 _skinId, uint256 _newPrice) external {
        require(skinToOwner[_skinId] == msg.sender, "You don't own this skin.");
        Skin storage skin = skins[_skinId];
        skin.price = _newPrice;
        
        emit SkinPriceModified(_skinId, _newPrice);
    }
}
