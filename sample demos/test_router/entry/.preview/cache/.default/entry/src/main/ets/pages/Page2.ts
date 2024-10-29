interface Page2_Params {
    message?: string;
    idnum?: number;
    objec?: TestImpl;
}
import router from "@ohos:router";
import type { TestImpl } from './Index';
interface RouteParams {
    id: number;
    name: string;
    obj: TestImpl;
}
class Page2 extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new ObservedPropertySimplePU('Hello World', this, "message");
        this.__idnum = new ObservedPropertySimplePU(1, this, "idnum");
        this.objec = undefined;
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params: Page2_Params) {
        if (params.message !== undefined) {
            this.message = params.message;
        }
        if (params.idnum !== undefined) {
            this.idnum = params.idnum;
        }
        if (params.objec !== undefined) {
            this.objec = params.objec;
        }
    }
    updateStateVars(params: Page2_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__idnum.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        this.__idnum.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __message: ObservedPropertySimplePU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    private __idnum: ObservedPropertySimplePU<number>;
    get idnum() {
        return this.__idnum.get();
    }
    set idnum(newValue: number) {
        this.__idnum.set(newValue);
    }
    private objec: TestImpl;
    aboutToAppear(): void {
        const params = router.getParams() as RouteParams;
        console.info(`${params.obj.name}`);
        this.idnum = params.id;
        this.objec = params.obj;
    }
    //     params = router.getParams() as RouteParams
    //     ied:number = this.params.id
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Page2.ets(24:5)");
            Row.height('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Page2.ets(25:7)");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.idnum.toString());
            Text.debugLine("entry/src/main/ets/pages/Page2.ets(26:9)");
            Text.fontSize(50);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.objec.age.toString());
            Text.debugLine("entry/src/main/ets/pages/Page2.ets(30:9)");
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Page2";
    }
}
registerNamedRoute(() => new Page2(undefined, {}), "", { bundleName: "com.example.test_router", moduleName: "entry", pagePath: "pages/Page2" });
