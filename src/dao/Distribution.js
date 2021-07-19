import React from "react";
import { withRouter } from "react-router";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { distribution, distributionVotes } from "../utils/queries/dao.query";
import { truncateAddress } from "../utils/helpers";
import { sharesSupply } from "../utils/general-functions";
import { ethers } from "ethers";
import { eDistribution, vDistribution } from "../utils/dao-functions";

class Distribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
      votes: null,
      loadingInfo: true,
      loadingVotes: true,
      supply: 0,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetchingInfo(id);
    this.fetchVotes(id);
  }

  async fetchingInfo(id) {
    const info = await distribution(id);
    const supply = await sharesSupply();
    console.log(supply);
    this.setState({
      info: info,
      loadingInfo: false,
      supply: supply,
    });
  }

  async fetchVotes(id) {
    const result = await distributionVotes(id);
    this.setState({
      votes: result,
      loadingVotes: false,
    });
  }

  async vote(support) {
    const { signer, connected } = this.props;
    const { info } = this.state;
    if (!connected) {
      this.props.open();
    } else {
      let result = await vDistribution(parseInt(info.id), support, signer);
      if (result) {
        this.fetchingInfo(info.id);
        this.fetchVotes(info.id);
      }
    }
  }

  async settle() {
    const { signer, connected } = this.props;
    const { info } = this.state;
    if (!connected) {
      this.props.open();
    } else {
      let result = await eDistribution(parseInt(info.id), signer);
      if (result) {
        this.fetchingInfo(parseInt(info.id));
        this.fetchVotes(parseInt(info.id));
      }
    }
  }

  render() {
    const { info, votes, supply, loadingInfo, loadingVotes } = this.state;
    return loadingInfo || loadingVotes ? null : (
      <div className="max-w mx-auto">
        <div className="max-w-5xl mx-auto mt-12">
          <div className="w-full mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0 inline-block">
                <div className="relative">
                  <p className="text-sm font-medium text-gray-500 mb-0">
                    Distribution Id
                  </p>
                </div>
              </div>
              <div>
                <h1 className="text-xl text-gray-900 mb-0">{info?.id}</h1>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
              {info?.Settled ? (
                <h1 className="special-text">SETTLED</h1>
              ) : info?.Rejected ? (
                <h1 className="special-text">REJECTED</h1>
              ) : ethers.utils.formatUnits(info?.voteFor, 18) / supply >=
                0.5 ? (
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gree-500"
                  onClick={() => this.settle()}
                >
                  Settle Tokens
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gree-500"
                    onClick={() => {
                      this.vote(false);
                    }}
                  >
                    Oppose Proposal
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gree-500"
                    onClick={() => {
                      this.vote(true);
                    }}
                  >
                    Support Proposal
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="mt-8 w-full mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="space-y-6 w-full">
              <section>
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 mt-5">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Proposal Hash
                        </dt>
                        <dd className="mt-4 text-sm text-gray-900">
                          <a
                            href=""
                            onClick={() =>
                              window.open(
                                `https://kovan.etherscan.io/tx/${info?.proposalHash}`
                              )
                            }
                            className="text-gray-900 flex items-center underline"
                          >
                            {truncateAddress(info?.proposalHash)}
                            <ExternalLinkIcon
                              className="w-6 h-5 text-gray-900 inline-block ml-1"
                              aria-hidden="true"
                            />
                          </a>
                        </dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Settlement Hash
                        </dt>
                        <dd className="mt-4 text-sm text-gray-900">
                          <a
                            href=""
                            onClick={() =>
                              window.open(
                                `https://kovan.etherscan.io/tx/${info?.SettlementHash}`
                              )
                            }
                            className="text-gray-900 flex items-center underline"
                          >
                            {truncateAddress(info?.SettlementHash)}
                            <ExternalLinkIcon
                              className="w-6 h-5 text-gray-900 inline-block ml-1"
                              aria-hidden="true"
                            />
                          </a>
                        </dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Voted For
                        </dt>
                        <dd className="mt-4 text-sm text-gray-900">
                          {info
                            ? (ethers.utils.formatUnits(info.voteFor, 18) /
                                supply) *
                              100
                            : 0.0}{" "}
                          %
                        </dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Vote Against
                        </dt>
                        <dd className="mt-4 text-sm text-gray-900">
                          {info
                            ? (ethers.utils.formatUnits(info.voteAgainst, 18) /
                                supply) *
                              100
                            : 0.0}{" "}
                          %
                        </dd>
                      </div>

                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Distribution Info
                        </dt>
                        <dd className="mt-4 text-sm text-gray-900">
                          <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                            {info?.earners.map((earner, idx) => (
                              <li
                                key={idx}
                                className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                              >
                                <div className="w-0 flex-1 flex items-center">
                                  <span className="ml-2 flex-1 w-0 truncate">
                                    {truncateAddress(earner)}
                                  </span>
                                </div>
                                <div className="w-0 flex-1 flex items-center">
                                  <span className="ml-2 flex-1 w-0 truncate">
                                    {info?.percentages[idx]} %
                                  </span>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <a
                                    onClick={() =>
                                      window.open(
                                        `https://kovan.etherscan.io/address/${earner}`
                                      )
                                    }
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                  >
                                    View Address
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>
              <section>
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <h2
                        id="notes-title"
                        className="text-lg font-medium text-gray-900"
                      >
                        Votes
                      </h2>
                    </div>
                    <div className="">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              User
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Votes
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Support
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Hash
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {votes?.map((vote, idx) => (
                            <tr
                              key={idx}
                              className={
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <a
                                  href={`https://kovan.etherscan.io/address/${vote.voter}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-gray-900 underline"
                                >
                                  {truncateAddress(vote.voter)}
                                </a>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {vote.votes / 10 ** 18}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {vote.support.toString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a
                                  href={`https://kovan.etherscan.io/address/${vote.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-gray-900 underline"
                                >
                                  {truncateAddress(vote.id)}
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Distribution);
