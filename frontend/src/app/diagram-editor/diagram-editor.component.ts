import { Component, Input, ViewChild } from '@angular/core';

import { DiagramComponent, DiagramModule, MarginModel, SymbolInfo, SymbolPaletteModule } from '@syncfusion/ej2-angular-diagrams';
import {
  Connector,
  ConnectorModel,
  Diagram,
  NodeModel,
  PaletteModel,
  UndoRedo
} from '@syncfusion/ej2-diagrams';
import { ExpandMode } from '@syncfusion/ej2-navigations';
import { User } from '../user';
import { UserService } from '../user.service';
import { AuthenticationService } from '../auth.service';

Diagram.Inject(UndoRedo); // add support for history management

@Component({
  selector: 'app-diagram-editor',
  imports: [DiagramModule, SymbolPaletteModule],
  templateUrl: './diagram-editor.component.html',
  styleUrl: './diagram-editor.component.css'
})
export class DiagramEditorComponent {

  @Input()
  _id: string = '';

  set id(id: string) {
    this._id = id;
    this.userService.getDiagram(id).subscribe((d) => {
      this.diagram.loadDiagram(d.diagram);
      console.log("Diagram received for id", this._id, d.diagram);
    });
  }

  get id(): string {
    return this._id;
  }

  constructor(
    private userService: UserService,
  ) {
  }

  title = 'frontend';
  @ViewChild('diagram')
  public diagram!: DiagramComponent;

  public expandMode: ExpandMode = 'Multiple';
  public palettes: PaletteModel[] = [
    {
      id: 'UmlActivity', expanded: true, title: 'clases de uml', symbols: [
        {
          id: 'class',
          style: {
            fill: '#26A0DA',
          },
          borderColor: 'white',
          shape: {
            type: 'UmlClassifier',
            classShape: {
              attributes: [
                { name: 'accepted', type: 'Date', style: { color: "red", fontFamily: "Arial", textDecoration: 'Underline', italic: true }, isSeparator: true },
                { name: 'sickness', type: 'History' },
                { name: 'prescription', type: 'String[*]' },
                { name: 'allergies', type: 'String[*]' }
              ],
              methods: [{ name: 'getHistory', style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' }],
              name: 'Patient'
            },
            classifier: 'Class'
          },
        },
        {
          id: 'Interface',
          style: {
            fill: '#26A0DA',
          }, borderColor: 'white',
          shape: {
            type: 'UmlClassifier',
            interfaceShape: {
              name: "Bank Account",
              attributes: [{
                name: "owner",
                type: "String[*]", style: {}
              },
              {
                name: "balance",
                type: "Dollars"
              }],
              methods: [{
                name: "deposit", style: {},
                parameters: [{
                  name: "amount",
                  type: "Dollars",
                  style: {}
                }],
              }]
            },
            classifier: 'Interface'
          },
        },
        {
          id: 'Enumeration',
          style: {
            fill: '#26A0DA',
          }, borderColor: 'white',
          shape: {
            type: 'UmlClassifier',
            enumerationShape: {
              name: 'AccountType',
              members: [
                {
                  name: 'Checking Account', style: {}
                },
                {
                  name: 'Savings Account'
                },
                {
                  name: 'Credit Account'
                }
              ]
            },
            classifier: 'Enumeration'
          },
        },
      ]
    },
    {
      id: 'umlConnectorrs', expanded: true, title: 'UML Classifier Connectors', symbols: [
        {
          id: 'Composition',
          sourcePoint: { x: 100, y: 200 },
          targetPoint: { x: 200, y: 300 },
          type: 'Straight',
          shape: { type: 'UmlClassifier', relationship: 'Composition' }
        },
        {
          id: 'BiDirectional',
          type: 'Straight',
          sourcePoint: { x: 300, y: 200 },
          targetPoint: { x: 400, y: 300 },
          shape: { type: 'UmlClassifier', relationship: 'Aggregation', associationType: 'BiDirectional' }
        },
        {
          id: 'Directional',
          type: 'Straight',
          sourcePoint: { x: 500, y: 200 },
          targetPoint: { x: 600, y: 300 },
          shape: { type: 'UmlClassifier', relationship: 'Association', associationType: 'Directional' }
        },
        {
          id: 'Association',
          type: 'Straight',
          sourcePoint: { x: 700, y: 200 },
          targetPoint: { x: 800, y: 300 },
          shape: { type: 'UmlClassifier', relationship: 'Association' }
        },
        {
          id: 'Inheritance',
          type: 'Straight',
          sourcePoint: { x: 900, y: 200 },
          targetPoint: { x: 1000, y: 300 },
          shape: { type: 'UmlClassifier', relationship: 'Inheritance' }
        },
        {
          id: 'Interfaces',
          type: 'Straight',
          sourcePoint: { x: 100, y: 400 },
          targetPoint: { x: 200, y: 500 },
          shape: { type: 'UmlClassifier', relationship: 'Interface' }
        },
        {
          id: 'Dependency',
          type: 'Straight',
          sourcePoint: { x: 300, y: 400 },
          targetPoint: { x: 400, y: 500 },
          shape: { type: 'UmlClassifier', relationship: 'Dependency' }
        },
        {
          id: 'Realization',
          type: 'Straight',
          sourcePoint: { x: 500, y: 400 },
          targetPoint: { x: 600, y: 500 },
          shape: { type: 'UmlClassifier', relationship: 'Realization' }
        },
        {
          id: "OneToMany",
          type: 'Straight',
          sourcePoint: {
            x: 700,
            y: 400
          },
          targetPoint: {
            x: 800,
            y: 500
          },
          annotations: [{
            margin: {
              top: 10,
              left: 10,
              right: 10,
              bottom: 20
            }
          }
          ],
          shape: {
            type: "UmlClassifier",
            relationship: 'Dependency',
            multiplicity: {
              type: 'OneToMany',
              source: {
                optional: true,
                lowerBounds: '89',
                upperBounds: '67'
              },
              target: { optional: true, lowerBounds: '78', upperBounds: '90' }
            }
          }
        },
        {
          id: "ManyToMany",
          sourcePoint: {
            x: 900,
            y: 400
          },
          targetPoint: {
            x: 1000,
            y: 500
          },
          annotations: [{
            margin: {
              top: 10,
              left: 10,
              right: 10,
              bottom: 20
            }
          }
          ],
          shape: {
            type: "UmlClassifier",
            relationship: 'Dependency',
            multiplicity: {
              type: 'ManyToMany',
              source: {
                optional: true,
                lowerBounds: '89',
                upperBounds: '67'
              },
              target: { optional: true, lowerBounds: '78', upperBounds: '90' }
            }
          }
        },
        {
          id: "OneToOne",
          sourcePoint: { x: 100, y: 600 },
          targetPoint: { x: 200, y: 700 },
          annotations: [{
            margin: {
              top: 10,
              left: 10,
              right: 10,
              bottom: 20
            }
          }
          ],
          shape: {
            type: "UmlClassifier",
            relationship: 'Dependency',
            multiplicity: {
              type: 'OneToOne',
              source: {
                optional: true,
                lowerBounds: '89',
                upperBounds: '67'
              },
              target: { optional: true, lowerBounds: '78', upperBounds: '90' }
            }
          }
        },
        {
          id: "ManyToOne",
          sourcePoint: { x: 300, y: 600 },
          targetPoint: { x: 400, y: 700 },
          annotations: [{
            margin: {
              top: 10,
              left: 10,
              right: 10,
              bottom: 20
            }
          }
          ],
          shape: {
            type: "UmlClassifier",
            relationship: 'Dependency',
            multiplicity: {
              type: 'ManyToOne',
              source: {
                optional: true,
                lowerBounds: '89',
                upperBounds: '67'
              },
              target: { optional: true, lowerBounds: '78', upperBounds: '90' }
            }
          }
        },
        {
          id: "OneToMany",
          sourcePoint: { x: 500, y: 600 },
          targetPoint: { x: 600, y: 700 },
          annotations: [{
            margin: {
              top: 10,
              left: 10,
              right: 10,
              bottom: 20
            }
          }
          ],
          shape: {
            type: "UmlClassifier",
            relationship: 'Dependency',
            multiplicity: {
              type: 'OneToMany',
            }
          }
        }
      ]
    }
  ];

  public nodes: NodeModel[] = [];

  public connectors: ConnectorModel[] = [
  ];

  // Set the default values of nodes.
  public getNodeDefaults(obj: NodeModel): NodeModel {
    obj.style = { fill: '#26A0DA', strokeColor: 'white' };
    return obj;
  }

  public created(): void {
    this.diagram.fitToPage();
  }

  // Set the default values of connectors.
  public getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
    return connector;
  }
  public dragEnter(arg: any): void {
    if (arg.element instanceof Connector) {
      arg.element.targetPoint.x += 100;
      arg.element.targetPoint.y += 20
    }
  }
  // Set an annoation style at runtime.
  public setNodeTemplate(node: any): void {
    if (node.annotations.length > 0) {
      for (let i: number = 0; i < node.annotations.length; i++) {
        node.annotations[i].style.color = 'white';
      }
    }
  }
  public getSymbolDefaults(symbol: NodeModel): void {
    symbol.width = 100;
    symbol.height = 100;
  }

  public getSymbolInfo(symbol: any): SymbolInfo {
    return { fit: true, description: { text: symbol.id, }, tooltip: symbol.addInfo ? symbol.addInfo['tooltip'] : symbol.id };
  }
  public symbolMargin: MarginModel = {
    left: 12, right: 12, top: 12, bottom: 12
  };

  private saveDiagram() {
    const data = JSON.parse(this.diagram.saveDiagram());
    this.userService.saveDiagram(this._id, data).subscribe(() => {
      console.log('Diagram sent to backend')
    })
  }

  historyChange(args: any): void {
    this.saveDiagram();
  }

}
