import { readable, writable } from 'svelte/store';

import {grpc} from "@improbable-eng/grpc-web";
// import {Empty} from "google-protobuf/google/protobuf/empty_pb";

import {ControlMsgServiceClient} from '$lib/pb/control_pb_service'

// import {Supporter, Supporters} from '$lib/pb/supporters_pb'
import {/*SupporterService,*/ SupporterServiceClient} from '$lib/pb/supporters_pb_service'

// import {Member, Members} from '$lib/pb/members_pb'
import {/*MemberService,*/ MemberServiceClient} from '$lib/pb/members_pb_service'

import {/*AddonQueueService,*/ AddonQueueServiceClient} from '$lib/pb/addon_queue_pb_service'
import {/*MainQueueService,*/ MainQueueServiceClient} from '$lib/pb/main_queue_pb_service'

const createServiceClients = () => {
  const serviceClients = {
    Control: null,
    ControlHandler: null,
    Supporter: null,
    Member: null,
    AddonQueue: null,
    MainQueue: null
  }

  const { subscribe } = readable({}, (set) => {
    set(serviceClients)
    return () => {};
  })

  return {
    subscribe,
    getControlServiceClient: (url) => {
      if (serviceClients.Control == null) {
        serviceClients.Control = new ControlMsgServiceClient(url, {transport: grpc.WebsocketTransport()})
      }
      serviceClients.ControlHandler = serviceClients.Control.control()
      return serviceClients.Control
    },
    getSupporterServiceClient: (url) => {
      if (serviceClients.Supporter == null) {
        serviceClients.Supporter = new SupporterServiceClient(url)
      }
      return serviceClients.Supporter
    },
    getMemberServiceClient: (url) => {
      if (serviceClients.Member == null) {
        serviceClients.Member = new MemberServiceClient(url)
      }
      return serviceClients.Member
    },
    getAddonQueueServiceClient: (url) => {
      if (serviceClients.AddonQueue == null) {
        serviceClients.AddonQueue = new AddonQueueServiceClient(url)
      }
      return serviceClients.AddonQueue
    },
    getMainQueueServiceClient: (url) => {
      if (serviceClients.MainQueue == null) {
        serviceClients.MainQueue = new MainQueueServiceClient(url)
      }
      return serviceClients.MainQueue
    }
  }
}

export const serviceClients = createServiceClients()
export const epochData = writable({})
export const supportersList = writable([])
export const membersList = writable([])
export const mainQueueMembers = writable([])
export const addonQueueMembers = writable([])
export const rules = writable([])
export const cardanoWallet = writable({})
