import { ElementId } from '@jbrowse/core/util/types/mst'
import PluginManager from '@jbrowse/core/PluginManager'
import { types } from 'mobx-state-tree'

export default function stateModelFactory(pluginManager: PluginManager) {
const stateModel = types
  .model({
    id: ElementId,
    displayName: 'BroadcastChannel',
    type: types.literal('BroadcastChannelView'),
    channel: types.string,
    communicate: types.boolean,
  })
  .actions((self) => ({
    // unused but required by your view
    setWidth() {},

    // for the BroadcastChannel service
    doSetChannel(channel: string) {
      pluginManager.getPlugin('BroadcastChannelPlugin').bc.setChannel(channel)
    },
    doSetCommunicate(communicate: boolean) {
      pluginManager.getPlugin('BroadcastChannelPlugin').bc.setCommunicate(communicate)
    },
  }))

  return stateModel
}

