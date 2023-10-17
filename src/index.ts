import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import ViewType from '@jbrowse/core/pluggableElementTypes/ViewType'
import { AbstractSessionModel, isAbstractMenuManager } from '@jbrowse/core/util'
import { version } from '../package.json'

// for BroadcastChannel view plugin
import { BroadcastChannelService } from '../scripts/BroadcastChannelService.js'
import {
  ReactComponent as BroadcastChannelViewReactComponent,
  stateModelFactory as broadcastChannelViewStateModelFactory,
} from './BroadcastChannelView'
import BroadcastChannelIcon from '@mui/icons-material/CellTower'

export default class BroadcastChannelPlugin extends Plugin {
  name = 'BroadcastChannelPlugin'
  version = version

  // TODO: get default (channel, communicate) from config.json (or package.json?)
  //bc = new BroadcastChannelService(default_channel, default_communicate)
  bc = new BroadcastChannelService('jbrowse', true)

  install(pluginManager: PluginManager) {
    pluginManager.addViewType(() => {
      return new ViewType({
        name: 'BroadcastChannelView',
        stateModel: broadcastChannelViewStateModelFactory(pluginManager),
        ReactComponent: BroadcastChannelViewReactComponent,
      })
    })
  }

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      pluginManager.rootModel.appendToMenu('Tools', {
        label: 'BroadcastChannel',
        icon: BroadcastChannelIcon,
        onClick: (session: AbstractSessionModel) => {
          // add the Broadcast Channel view only if one does not already exist
          // (could also dim the menu item)
          if (session.views.find((v) => v.type == 'BroadcastChannelView' )) return
          session.addView('BroadcastChannelView', {
            channel: this.bc.getChannel(),
            communicate: this.bc.getCommunicate(),
          })
        },
      })
    }

    // Handle feature mouseover
    pluginManager.jexl.addFunction(
      'mouseover',
      (feature: any) => {
        const featureJson = feature.toJSON()
        if (featureJson.type == 'gene') {
          this.bc.postMessage({ type: 'select', targets: { genes: [ featureJson.id ] }})
        }
      },
    )
  }
}
