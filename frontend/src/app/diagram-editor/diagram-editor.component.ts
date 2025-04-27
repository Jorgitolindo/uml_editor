import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { ToolbarComponent } from "../toolbar/toolbar.component";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

Diagram.Inject(UndoRedo); // add support for history management

@Component({
  selector: 'app-diagram-editor',
  imports: [DiagramModule, SymbolPaletteModule, ToolbarComponent],
  templateUrl: './diagram-editor.component.html',
  styleUrl: './diagram-editor.component.css'
})
export class DiagramEditorComponent implements OnInit, OnDestroy {
  id: string = '';

  private stompClient: any;
  private isChangeOriginator = false;
  private isProcessingIncomingChange = false;
  /** Subject que acumula cambios y dispara el guardado tras 500 ms de inactividad */
  private saveSubject = new Subject<any>();
  private lastSavedJson: string | null = null;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    // 1) Conectar al servidor SockJS vía proxy
    const socket = new SockJS('/ws');
    this.stompClient = Stomp.over(socket);

    // 2) Antes de suscribirte, asegúrate de capturar el ID de la ruta
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

      // 3) Suscribirse al topic global
      this.stompClient.connect({}, () => {
        this.stompClient.subscribe(`/topic/notifications`, (message: any) => {
          const payload = JSON.parse(message.body) as { id: string;username: string; diagram: any };

          // 🔍 Filtra solo los mensajes de *tu* diagrama
          if (payload.id !== this.id) {
            return;
          }

          this.lastEditor = payload.username;
          const remoteJson = JSON.stringify(payload.diagram);

          // 4) Si coincide con nuestro último guardado, lo descartamos
          if (this.lastSavedJson === remoteJson) {
            this.lastSavedJson = null;
            return;
          }

          // 5) Carga el diagrama remoto
          this.diagram.loadDiagram(payload.diagram);
        });
      }, (error: any) => {
        console.error("Error connecting to WebSocket", error);
      });

      // 6) Carga inicial del diagrama vía REST
      this.userService.getDiagram(this.id).subscribe(d => {
        this.diagram.loadDiagram(d.diagram);
        console.log("Diagram received for id", this.id, d.diagram);
      });
    });

    // 7) Mantén tu lógica de debounce/autosave igual…
    this.saveSubject.pipe(debounceTime(500))
      .subscribe(diagramData => {
        this.lastSavedJson = JSON.stringify(diagramData);
        this.userService.saveDiagram(this.id, diagramData)
          .subscribe(() => this.isChangeOriginator = false);
      });
  }


  ngOnDestroy(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => { });
    }
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
  public lastEditor: string = '';
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
    if (this.isProcessingIncomingChange) {
      return;
    }
    this.isChangeOriginator = true;
    const data = JSON.parse(this.diagram.saveDiagram());
    this.userService.saveDiagram(this.id, data).subscribe(() => {
      this.isChangeOriginator = false;
    })
  }

  historyChange(args: any): void {
    if (this.isProcessingIncomingChange) {
      return;
    }
    this.isChangeOriginator = true;

    setTimeout(() => {
      const data = JSON.parse(this.diagram.saveDiagram());
      this.saveSubject.next(data);
    });
  }


}
