
import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

//import WalletConnect from "@walletconnect/client/dist/cjs/index.js";
import { WalletConnect } from "./plugins/walletConnect/walletconnect-bundle.js";

/**
 * Predefined variables
 * Name = AnkrWeb3
 * DateTime = Fri May 06 2022 06:26:41 GMT+0300 (GMT+03:00)
 * Author = muhammedea
 * FileBasename = AnkrWeb3.ts
 * FileBasenameNoExtension = AnkrWeb3
 * URL = db://assets/scripts/AnkrWeb3.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('AnkrWeb3')
export class AnkrWeb3 extends Component {
  connector;
  uri;
  accounts;
  chainId;
  device_id;
  _provider;
  abi;
  redis_client;
  login;
  connected;

  // [2]
  // @property
  // serializableDummy = 0;

  start() {
    // [3]
  }

  // update (deltaTime: number) {
  //     // [4]
  // }


  get active_account() {
    return this.accounts[0];
  }

  create_connection(session) {
    if (session) {
      // if session, restore it
      var connector = new WalletConnect({
        bridge: "",
        clientMeta: {
          description: "Mirage Unreal SDK",
          url: "https://github.com/mirage-xyz",
          icons: [""],
          name: "Mirage Unreal SDK",
        },
        session: session
      });
      connector.updateSession(connector.session);
      // var connector = new WalletConnect(session);
    } else {
      // Create a new connector
      var connector = new WalletConnect({
        bridge: "https://testbridge.yartu.io/", // "https://bridge.walletconnect.org", // Required
        //qrcodeModal: QRCodeModal,
        clientMeta: {
          description: "Mirage Unreal SDK",
          url: "https://github.com/mirage-xyz",
          icons: [""],
          name: "Mirage Unreal SDK",
        }
      });
    }

    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      console.log('Client Connected ', payload);
      this.connected = true;

      // Get provided accounts and chainId
      this.accounts = payload.params[0].accounts;
      this.chainId = payload.params[0].chainId;
      //this._provider = new ethers.providers.JsonRpcProvider(get_rpc_url(this.chainId));
    });

    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      console.log('session_update ', payload);

      // Get updated accounts and chainId
      this.accounts = payload.params[0].accounts;
      this.chainId = payload.params[0].chainId;
      this.connected = true;
      //this._provider = new ethers.providers.JsonRpcProvider(get_rpc_url(this.chainId));
    });

    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }

      console.log('disconnected ', payload);

      this.uri = null;
      this.connector = null;
      this.chainId = null;
      this.connected = false;
      // Delete walletConnector
    });

    // Check if connection is already established
    if (!connector.connected) {
      // create new session
      if (session) {
        return connector.connect().then(() => {
          // get uri for QR Code modal
          this.uri = connector.uri;
          this.connector = connector;
          this.login = false;

          return connector.uri;
        });
      } else {
        return connector.createSession().then(() => {
          // get uri for QR Code modal
          this.uri = connector.uri;
          this.connector = connector;
          this.login = true;

          return connector.uri;
        });
      }
    } else {
      sys.openURL('https://docs.cocos.com/creator/manual/en/editor/console/');
      return;
      return connector.connect().then(() => {
        // get uri for QR Code modal
        this.uri = connector.uri;
        this.connector = connector;
        this.login = false;

        return connector.uri;
      });
    }
  }

  /*get_message_hash(message) {
    let message_hash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(message)
    );
    return message_hash;
  }*/

  /*verify_message(message, signature) {
    try {
      return ethers.utils.verifyMessage(message, signature);
    } catch (error) {
      return false;
    }
  }*/

  /*call_method(method_name, abi_hash, contract_address, args) {
    const abi = abi_list[abi_hash];
    const contract = new ethers.Contract(contract_address, abi, this._provider);
 
    const _call = contract[method_name];
    console.log(_call);
    if(args.length === 0 || args[0] === '') {
      console.log('call in if')
      return _call.apply(null);
    } else {
      console.log('call in else');
      return _call.apply(null, args);
    }
  }*/

  /*prepare_transaction(method_name, abi_hash, contract_address, args) {
    const abi = abi_list[abi_hash];
    const contract = new ethers.Contract(contract_address, abi);
 
    const _call = contract.populateTransaction[method_name];
    if(args.length == 0 || args[0] == '') {
      return _call.apply(null);
    } else {
      return _call.apply(null, args);
    }
  }*/

  get_transaction(tx_id) {
    return this._provider.getTransaction(tx_id);
  }

}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
