import { BaseDetailPagePo } from '@/cypress/e2e/po/pages/base/base-detail-page.po';
import { BaseListPagePo } from '@/cypress/e2e/po/pages/base/base-list-page.po';
import BaseResourceList from '@/cypress/e2e/po/lists/base-resource-list.po';
import LabeledInputPo from '@/cypress/e2e/po/components/labeled-input.po';
import LabeledSelectPo from '@/cypress/e2e/po/components/labeled-select.po';
import WorkloadPagePo from '@/cypress/e2e/po/pages/explorer/workloads.po';
import PromptRemove from '@/cypress/e2e/po/prompts/promptRemove.po';
import TabbedPo from '@/cypress/e2e/po/components/tabbed.po';
import WorkloadPodStoragePo from '@/cypress/e2e/po/components/workloads/pod-storage.po';
import ContainerMountPathPo from '@/cypress/e2e/po/components/workloads/container-mount-paths.po';
import { WorkloadType } from '@shell/types/fleet';
import ProductNavPo from '@/cypress/e2e/po/side-bars/product-side-nav.po';

export class workloadDetailsPageBasePo extends BaseDetailPagePo {
  static url: string;

  private static createPath(
    workloadId: string,
    clusterId: string,
    workloadType: WorkloadType,
    namespaceId: string,
    queryParams?: Record<string, string>
  ) {
    const urlStr = `/c/${ clusterId }/explorer/${ workloadType }/${ namespaceId }/${ workloadId }`;

    if (!queryParams) {
      return urlStr;
    }

    const params = new URLSearchParams(queryParams);

    return `${ urlStr }?${ params.toString() }`;
  }

  static goTo(): Cypress.Chainable<Cypress.AUTWindow> {
    return super.goTo(this.url);
  }

  constructor(workloadId: string, clusterId: string, workloadType: WorkloadType, queryParams?: Record<string, string>, namespaceId = 'default') {
    super(workloadDetailsPageBasePo.createPath(workloadId, clusterId, workloadType, namespaceId, queryParams));

    workloadDetailsPageBasePo.url = workloadDetailsPageBasePo.createPath(
      workloadId,
      clusterId,
      workloadType,
      namespaceId,
      queryParams
    );
  }

  private workload() {
    return new WorkloadPagePo();
  }

  deleteWithKubectl(name: string, namespace = 'default') {
    this.workload().deleteWithKubectl(name, namespace);
  }

  createWithKubectl(blueprintJson: string | Object, wait = 6000 ) {
    this.workload().createWithKubectl(blueprintJson, wait);
  }

  podScaleUp(): Cypress.Chainable {
    return this.self().find('.btn-sm .icon-plus');
  }

  podScaleDown(): Cypress.Chainable {
    return this.self().find('.btn-sm .icon-minus');
  }

  podsRunningTotal(): Cypress.Chainable {
    return this.self().find('.count-gauge h1').first();
  }

  gaugesPods(): Cypress.Chainable {
    return this.self().find('.gauges__pods');
  }
}

export class WorkloadsListPageBasePo extends BaseListPagePo {
  static createPath(clusterId: string, workloadType: WorkloadType, queryParams?: Record<string, string>) {
    const urlStr = `/c/${ clusterId }/explorer/${ workloadType }`;

    if (!queryParams) {
      return urlStr;
    }

    const params = new URLSearchParams(queryParams);

    return `${ urlStr }?${ params.toString() }`;
  }

  constructor(clusterId = 'local', workloadType: WorkloadType, queryParams?: Record<string, string>) {
    super(WorkloadsListPageBasePo.createPath(clusterId, workloadType, queryParams));
  }

  static navTo() {
    const sideNav = new ProductNavPo();

    sideNav.navToSideMenuGroupByLabel('Workloads');
  }

  navigateToCreatePage() {
    const baseResourceList = new BaseResourceList(this.self());

    return baseResourceList.masthead().actions().eq(0).click();
  }

  resourcesList() {
    return new BaseResourceList(this.self());
  }

  sortableTable() {
    return this.resourcesList().resourceTable().sortableTable();
  }

  details(name: string, index: number) {
    return this.sortableTable().rowWithName(name).column(index);
  }

  deleteItemWithUI(name: string) {
    this.sortableTable().rowActionMenuOpen(name).getMenuItem('Delete').scrollIntoView()
      .click();

    const promptRemove = new PromptRemove();

    promptRemove.remove();
  }

  deleteAndWaitForRequest(name: string) {
    cy.intercept('DELETE', 'v1/apps.deployments/**').as('deleteDeployment');
    this.deleteItemWithUI(name);

    return cy.wait('@deleteDeployment');
  }

  createWithKubectl(blueprintJson: string | Object, wait = 6000, timeout = { timeout: 10000 }) {
    this.workload().createWithKubectl(blueprintJson, wait, timeout);
  }

  listElementWithName(name: string) {
    return this.sortableTable().rowElementWithName(name);
  }

  goToDetailsPage(elemName: string) {
    return this.sortableTable().detailsPageLinkWithName(elemName).click();
  }

  goToEditYamlPage(elemName: string) {
    return this.sortableTable().rowActionMenuOpen(elemName).getMenuItem('Edit YAML').click();
  }

  goToEditConfigPage(elemName: string) {
    return this.sortableTable().rowActionMenuOpen(elemName).getMenuItem('Edit Config').click();
  }

  private workload() {
    return new WorkloadPagePo();
  }

  deleteWithKubectl(name: string, namespace = 'default') {
    this.workload().deleteWithKubectl(name, namespace);
  }
}

export class WorkloadsCreatePageBasePo extends BaseDetailPagePo {
  static createPath(clusterId: string, workloadType: WorkloadType, queryParams?: Record<string, string>) {
    const urlStr = `/c/${ clusterId }/explorer/${ workloadType }/create`;

    if (!queryParams) {
      return urlStr;
    }

    const params = new URLSearchParams(queryParams);

    return `${ urlStr }?${ params.toString() }`;
  }

  constructor(clusterId = 'local', workloadType: WorkloadType, queryParams?: Record<string, string>) {
    super(WorkloadsCreatePageBasePo.createPath(clusterId, workloadType, queryParams));
  }

  selectNamespace(label: string) {
    const selectVerb = new LabeledSelectPo(`[data-testid="name-ns-description-namespace"]`, this.self());

    selectVerb.toggle();
    selectVerb.clickLabel(label);
  }

  namespace(): LabeledInputPo {
    return LabeledInputPo.byLabel(this.self(), 'Namespace');
  }

  containerImage(): LabeledInputPo {
    return LabeledInputPo.byLabel(this.self(), 'Container Image');
  }

  addEnvironmentVariable() {
    cy.get('[data-testid="add-env-var"]').click();
  }

  removeEnvironmentVariable(index: number) {
    cy.get(`[data-testid="env-var-row-${ index }"] .remove button`).click();
  }

  environmentVariableKeyInput(index: number) {
    return LabeledInputPo.bySelector(this.self(), `[data-testid="env-var-row-${ index }"] .name`);
  }

  environmentVariableValueInput(index: number) {
    return LabeledInputPo.bySelector(this.self(), `[data-testid="env-var-row-${ index }"] .single-value`);
  }

  /**
   *
   * @returns po for the top level tabs in workloads ie general workload, pod, and one more per container
   */
  horizontalTabs(): TabbedPo {
    return new TabbedPo('[data-testid="workload-horizontal-tabs"]');
  }

  /**
   *
   * @returns po for the vertical tabs within the first horizontal tab, ie non-pod workload configuration
   */
  generalTabs(): TabbedPo {
    return new TabbedPo('[data-testid="workload-general-tabs"]');
  }

  /**
   *
   * @returns po for the vertical tabs within the pod tab
   */
  podTabs(): TabbedPo {
    return new TabbedPo('[data-testid="workload-pod-tabs"]');
  }

  /**
   *
   * @param containerIndex
   * @returns po for vertical tabs used to configure nth container
   */
  nthContainerTabs(containerIndex: number) {
    this.horizontalTabs().clickTabWithSelector(`>ul>li:nth-child(${ containerIndex + 3 })`);

    return new TabbedPo(`[data-testid="workload-container-tabs-${ containerIndex }"]`);
  }

  podStorage(): WorkloadPodStoragePo {
    return new WorkloadPodStoragePo();
  }

  containerStorage(): ContainerMountPathPo {
    return new ContainerMountPathPo();
  }

  createWithUI(name: string, containerImage: string, namespace = 'default') {
    // NB: namespace is already selected by default
    this.selectNamespace(namespace);
    this.resourceDetail().createEditView().nameNsDescription().name()
      .set(name);
    this.containerImage().set(containerImage);
    this.resourceDetail().createEditView().save();
  }

  private workload() {
    return new WorkloadPagePo();
  }

  deleteWithKubectl(name: string, namespace = 'default') {
    this.workload().deleteWithKubectl(name, namespace);
  }

  createWithKubectl(blueprintJson: string | Object, wait = 6000) {
    this.workload().createWithKubectl(blueprintJson, wait);
  }
}
